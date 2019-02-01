using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using ChangeManagementSystem.Models;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;

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

            return View("NewCmd");
        }

        public JsonResult UserList(string prefix)
        {
            var users = new List<ApplicationUser>();

            users = _context.Users.ToList();

            var userList = from u in users
                where u.Firstname.Contains(prefix)
                where u.Id != User.Identity.GetUserId()
                select new {u.Lastname, u.Firstname, u.JobRoles.JobRoleName};

            return Json(userList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Save(ChangeManagementModels cmdModel)
        {
            var generator = new Random();
            //String r = generator.Next(0, 99999).ToString("D5");

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
            var CmdList = _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null).ToList();

            return Json(CmdList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAllIncoming()
        {
            var incomingCmdList =
                _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null)
                    .OrderBy(c => c.TargetImplementation)
                    .ToList()
                    .Take(5);

            return Json(incomingCmdList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCmdCount()
        {
            var cmdCount = _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null).Count();

            return Json(cmdCount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetImplementedCmdCount()
        {
            var implementedCmdCount =
                _context.ChangeManagements.Where(c => c.IsImplemented && c.DeletedAt == null).Count();

            return Json(implementedCmdCount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Find(int id)
        {
            var cmdRecord = _context.ChangeManagements.Where(c => c.Id == id).FirstOrDefault();

            return Json(cmdRecord, JsonRequestBehavior.AllowGet);
        }

        [ValidateAntiForgeryToken]
        public ActionResult Update(ChangeManagementModels cmdModel, int id)
        {
            var cmdRecord = _context.ChangeManagements.Where(c => c.Id == id).FirstOrDefault();


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
            var cmdRecord = _context.ChangeManagements.Where(c => c.Id == id).FirstOrDefault();

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
            var cmdRecord = _context.ChangeManagements.Where(c => c.Id == id).FirstOrDefault();

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

            var cmdModel = new List<AffectedAreasModels>();
            var jsonAffectedArea = "";
            var jsonSignOff = "";
            var targetImplementation = new DateTime();

            var appList = new List<string>();
            var dbList = new List<string>();
            var serverList = new List<string>();

            var signoffReviewedByList = new List<string>();
            var signoffSignatureList = new List<string>();
            var signoffInfoList = new List<string>();
            var signoffRoleList = new List<string>();
            var signoffDateList = new List<string>();

            cmdModel = _context.Users
                .Join(_context.ChangeManagements
                    , users => users.Id
                    , cmd => cmd.RequestorId,
                    (users, cmd) => new {User = users, Cmd = cmd})
                .Where(UserCmd => UserCmd.Cmd.Id == id)
                .Select(UserCmd => new AffectedAreasModels
                {
                    CmdNo = UserCmd.Cmd.CmdNo,
                    ChangeObjective = UserCmd.Cmd.ChangeObjective,
                    ChangeType = UserCmd.Cmd.ChangeType,
                    ChangeRequirements = UserCmd.Cmd.ChangeRequirements,
                    AffectedAreas = UserCmd.Cmd.AffectedAreas,
                    ChangeEvaluation = UserCmd.Cmd.ChangeEvaluation,
                    TargetImplementation = UserCmd.Cmd.TargetImplementation,
                    RequestorName = UserCmd.User.Firstname + " " + UserCmd.User.Lastname,
                    RequestorRole = UserCmd.User.JobRoles.JobRoleName,
                    SignOff = UserCmd.Cmd.SignOff,
                    CreatedAt = UserCmd.Cmd.CreatedAt ?? from,
                    UpdatedAt = UserCmd.Cmd.UpdatedAt ?? from,
                    DeletedAt = UserCmd.Cmd.DeletedAt ?? from
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

            var cmdPercentagePerStatus = _context.ChangeManagements
                .Select(d => new
                {
                    implemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented && p.ImplementedAt.Value.Month == month).ToList().Count),
                    notImplemented = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation > now && p.TargetImplementation.Month == month).ToList().Count),
                    pastTheDeadline = (_context.ChangeManagements.Where(p => p.DeletedAt == null && p.IsImplemented == false && p.TargetImplementation < now && p.TargetImplementation.Month == month).ToList().Count)
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