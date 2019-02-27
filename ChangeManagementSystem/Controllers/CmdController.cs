﻿using ChangeManagementSystem.Models;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    public class Item
    {
        public string Application;
        public string Database;
        public string Server;
    }

    [Authorize]
    public class CmdController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CmdController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        // GET: Cmd
        public ActionResult New()
        {
            ViewBag.Current = "New Change Document";

            var userId = User.Identity.GetUserId();

            IEnumerable<SelectListItem> users = _context.Users.Where(u => u.Id != userId).Select(u => new SelectListItem
            {
                Value = u.Id.ToString(),
                Text = u.Firstname + " " + u.Lastname + " ~ " + u.JobRoles.JobRoleName
            });

            ViewBag.SignOff = users;

            return View("NewCmd");
        }

        public JsonResult UserList(string prefix)
        {
            var users = _context.Users.ToList();

            var userList = from u in users
                           where u.Firstname.Contains(prefix)
                           where u.Id != User.Identity.GetUserId()
                           select new { u.Lastname, u.Firstname, u.JobRoles.JobRoleName };

            return Json(userList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetLoggedUserInfo()
        {
            var userId = User.Identity.GetUserId();
            var userInfo = _context.Users.SingleOrDefault(u => u.Id == userId);

            return Json(userInfo, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Save(ChangeManagementModels cmdModel)
        {
            var r = DateTime.UtcNow.ToLocalTime().Hour + DateTime.UtcNow.ToLocalTime().Minute.ToString() +
                    DateTime.UtcNow.ToLocalTime().Second;

            cmdModel.CmdNo = "CMD-" + DateTime.Now.Year + "-" + r;
            cmdModel.CreatedAt = DateTime.Now;
            cmdModel.UpdatedAt = DateTime.Now;
            cmdModel.DeletedAt = null;
            cmdModel.ImplementedAt = null;
            cmdModel.RequestorId = User.Identity.GetUserId();
            cmdModel.IsImplemented = false;
            _context.ChangeManagements.Add(cmdModel);

            _context.SaveChanges();

            return RedirectToAction("New");
        }

        public ActionResult All()
        {
            ViewBag.Current = "Manage Change Document";

            return View("AllCmd");
        }

        public ActionResult GetAll()
        {
            var cmdList = _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null).OrderBy(c => c.TargetImplementation).ToList();

            var cmdIdList = new List<int>();

            var userId = User.Identity.GetUserId();

            foreach (var cmdListItem in cmdList)
            {
                var jsonSignOff = cmdListItem.SignOff;
                dynamic dynObj = JsonConvert.DeserializeObject(jsonSignOff);

                foreach (var dynObjItem in dynObj)
                {
                    if (!dynObjItem[""].ToString().Equals(userId)) continue;
                    cmdIdList.Add(cmdListItem.Id);
                    break;
                }
            }

            var cmdListFiltered = _context.ChangeManagements.Where(c => cmdIdList.Contains(c.Id) && c.IsImplemented != true && c.DeletedAt == null).OrderBy(c => c.TargetImplementation).ToList();

            return Json(cmdListFiltered, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAllIncoming()
        {
            var now = DateTime.UtcNow.ToLocalTime();

            var incomingCmdList =
                _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null && c.TargetImplementation > now)
                    .OrderBy(c => c.TargetImplementation)
                    .ToList()
                    .Take(5);

            return Json(incomingCmdList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCmdCount()
        {
            var cmdCount = _context.ChangeManagements.Count(c => c.IsImplemented != true && c.DeletedAt == null);

            return Json(cmdCount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetImplementedCmdCount()
        {
            var implementedCmdCount =
                _context.ChangeManagements.Count(c => c.IsImplemented && c.DeletedAt == null);

            return Json(implementedCmdCount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Find(int id)
        {
            var cmdRecord = _context.ChangeManagements.FirstOrDefault(c => c.Id == id);

            return Json(cmdRecord, JsonRequestBehavior.AllowGet);
        }

        [ValidateAntiForgeryToken]
        public ActionResult Update(ChangeManagementModels cmdModel, int id)
        {
            var cmdRecord = _context.ChangeManagements.FirstOrDefault(c => c.Id == id);

            if (cmdRecord != null)
            {
                cmdRecord.ChangeObjective = cmdModel.ChangeObjective;
                cmdRecord.ChangeType = cmdModel.ChangeType;
                cmdRecord.ChangeRequirements = cmdModel.ChangeRequirements;
                cmdRecord.AffectedAreas = cmdModel.AffectedAreas;
                cmdRecord.ChangeEvaluation = cmdModel.ChangeEvaluation;
                cmdRecord.TargetImplementation = cmdModel.TargetImplementation;
                cmdRecord.SignOff = cmdModel.SignOff;
                cmdRecord.UpdatedAt = DateTime.Now;
            }

            _context.Entry(cmdRecord).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("All");
        }

        public ActionResult Delete(int id)
        {
            var cmdRecord = _context.ChangeManagements.FirstOrDefault(c => c.Id == id);

            if (cmdRecord != null)
            {
                cmdRecord.DeletedAt = DateTime.Now;
            }

            _context.Entry(cmdRecord).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("All");
        }

        public ActionResult Implement(int id)
        {
            var userId = User.Identity.GetUserId();
            var userInfo = _context.Users.SingleOrDefault(u => u.Id == userId);

            if (userInfo != null && !userInfo.JobRoles.CanImplement)
            {
                ModelState.AddModelError("unauthorize", "Not authorized");
                return RedirectToAction("All");
            }
            var cmdRecord = _context.ChangeManagements.FirstOrDefault(c => c.Id == id);

            if (cmdRecord != null)
            {
                cmdRecord.IsImplemented = true;
                cmdRecord.ImplementedAt = DateTime.Now;
            }

            _context.Entry(cmdRecord).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("All");
        }

        public ActionResult ExportCmd(int id)
        {
            var from = DateTime.Parse("10/01/2011");

            var rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports/CmdReport.rpt")));

            var jsonAffectedArea = "";
            var jsonSignOff = "";
            var targetImplementation = new DateTime();

            var appList = new List<string>();
            var dbList = new List<string>();
            var serverList = new List<string>();

            var signoffInfoList = new List<string>();

            var cmdModel = _context.Users
                .Join(_context.ChangeManagements
                    , users => users.Id
                    , cmd => cmd.RequestorId,
                    (users, cmd) => new { User = users, Cmd = cmd })
                .Where(userCmd => userCmd.Cmd.Id == id)
                .Select(userCmd => new AffectedAreasModels
                {
                    CmdNo = userCmd.Cmd.CmdNo,
                    ChangeObjective = userCmd.Cmd.ChangeObjective,
                    ChangeType = userCmd.Cmd.ChangeType,
                    ChangeRequirements = userCmd.Cmd.ChangeRequirements,
                    AffectedAreas = userCmd.Cmd.AffectedAreas,
                    ChangeEvaluation = userCmd.Cmd.ChangeEvaluation,
                    TargetImplementation = userCmd.Cmd.TargetImplementation,
                    RequestorName = userCmd.User.Firstname + " " + userCmd.User.Lastname,
                    RequestorRole = userCmd.User.JobRoles.JobRoleName,
                    SignOff = userCmd.Cmd.SignOff,
                    CreatedAt = userCmd.Cmd.CreatedAt ?? @from,
                    UpdatedAt = userCmd.Cmd.UpdatedAt ?? @from,
                    DeletedAt = userCmd.Cmd.DeletedAt ?? @from
                }).ToList();

            foreach (var cmdModelItem in cmdModel)
            {
                jsonAffectedArea = cmdModelItem.AffectedAreas;
                jsonSignOff = cmdModelItem.SignOff;
                targetImplementation = cmdModelItem.TargetImplementation;
            }

            dynamic dynObj = JsonConvert.DeserializeObject(jsonAffectedArea);
            dynamic dynObjSignOff = JsonConvert.DeserializeObject(jsonSignOff);

            var appValue = "";
            var dbValue = "";
            var serverValue = "";

            var signoffInfoValue = "";

            rd.SetDataSource(cmdModel);

            foreach (var dynObjItem in dynObj)
            {
                appList.Add(dynObjItem["Application"].ToString());
                dbList.Add(dynObjItem["Database"].ToString());
                serverList.Add(dynObjItem["Server"].ToString());
            }

            appValue = string.Join("\n\n", appList);
            dbValue = string.Join("\n\n", dbList);
            serverValue = string.Join("\n\n", serverList);

            foreach (var dynObjSignOffItem in dynObjSignOff)
            {
                signoffInfoList.Add("REVIEWED BY:\n");
                signoffInfoList.Add("Signature:");
                signoffInfoList.Add("Printed Name: " + dynObjSignOffItem["Name"].ToString());
                signoffInfoList.Add("Role: " + dynObjSignOffItem["Role"].ToString());
                signoffInfoList.Add("Date:\n");
            }

            signoffInfoValue = string.Join("\n", signoffInfoList);

            rd.SetParameterValue("Application", appValue);
            rd.SetParameterValue("Database", dbValue);
            rd.SetParameterValue("Server", serverValue);

            rd.SetParameterValue("ImplementationTargetDate", targetImplementation.ToShortDateString());
            rd.SetParameterValue("ImplementationTargetTime", targetImplementation.ToShortTimeString());

            rd.SetParameterValue("SignOffInfo", signoffInfoValue);

            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();

            var stream = rd.ExportToStream(ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream, "application/pdf",
                DateTime.UtcNow.ToShortDateString() + "_" + DateTime.UtcNow.ToLocalTime().ToShortTimeString() + ".pdf");
        }

        public ActionResult History()
        {
            ViewBag.Current = "Change Document History";

            return View("HistoryCmd");
        }

        public ActionResult GetAllHistory()
        {
            var cmdListHistory = _context.ChangeManagements.Where(c => c.IsImplemented && c.DeletedAt == null).ToList();

            return Json(cmdListHistory, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult GetCmdPercentage()
        {
            var now = DateTime.UtcNow.ToLocalTime();

            var cmdPercentagePerStatus = _context.ChangeManagements
                .Select(d => new
                {
                    implemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented).ToList().Count * 100.00) / (_context.ChangeManagements.Where(a => a.DeletedAt == null).ToList().Count),
                    notImplemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation > now).ToList().Count * 100.00) / (_context.ChangeManagements.Where(a => a.DeletedAt == null).ToList().Count),
                    pastTheDeadline = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation < now).ToList().Count * 100.00) / (_context.ChangeManagements.Where(a => a.DeletedAt == null).ToList().Count)
                }).FirstOrDefault();

            return Json(cmdPercentagePerStatus, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult GetCmdPercentagePerMonth(int month)
        {
            var now = DateTime.UtcNow.ToLocalTime();
            var year = now.Year;

            var cmdPercentagePerStatus = _context.ChangeManagements
                .Select(d => new
                {
                    implemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented && p.ImplementedAt.Value.Month == month && p.ImplementedAt.Value.Year == year).ToList().Count),
                    notImplemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation > now && p.TargetImplementation.Month == month && p.TargetImplementation.Year == year).ToList().Count),
                    pastTheDeadline = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation < now && p.TargetImplementation.Month == month && p.TargetImplementation.Year == year).ToList().Count)
                }).FirstOrDefault();

            return Json(cmdPercentagePerStatus, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Calendar()
        {
            ViewBag.Current = "Change Document Calendar";

            return View("CalendarCmd");
        }

        [AllowAnonymous]
        public ActionResult GetChangesImplemented()
        {
            var cmdListImplementationDates = _context.ChangeManagements
                .Where(d => d.DeletedAt == null && d.IsImplemented)
                .Select(d => new
                {
                    title = d.CmdNo,
                    start = d.ImplementedAt,
                    end = d.ImplementedAt,
                    areas = d.Id,
                    color = "green"
                })
                .ToList();

            return Json(cmdListImplementationDates, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult GetChangesUnImplemented()
        {
            var now = DateTime.UtcNow.ToLocalTime();

            var cmdListImplementationDates = _context.ChangeManagements
                .Where(d => d.DeletedAt == null && d.IsImplemented == false && d.TargetImplementation > now)
                .Select(d => new
                {
                    title = d.CmdNo,
                    start = d.TargetImplementation,
                    end = d.TargetImplementation,
                    areas = d.Id,
                    color = "orange"
                })
                .ToList();

            return Json(cmdListImplementationDates, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        public ActionResult GetChangesPastTheDeadline()
        {
            var now = DateTime.UtcNow.ToLocalTime();

            var cmdListImplementationDates = _context.ChangeManagements
                .Where(d => d.DeletedAt == null && d.IsImplemented == false && d.TargetImplementation < now)
                .Select(d => new
                {
                    title = d.CmdNo,
                    start = d.TargetImplementation,
                    end = d.TargetImplementation,
                    areas = d.Id,
                    color = "red",
                    now
                })
                .ToList();

            return Json(cmdListImplementationDates, JsonRequestBehavior.AllowGet);
        }
    }
}