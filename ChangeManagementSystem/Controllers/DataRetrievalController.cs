using ChangeManagementSystem.Models;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    public class DataRetrievalController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DataRetrievalController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        //Data Retrieval

        public ActionResult GetLoggedUserInfo()
        {
            var userId = User.Identity.GetUserId();
            var userInfo = _context.Users.SingleOrDefault(u => u.Id == userId);

            if (userInfo != null) ViewBag.CanImplementStatus = userInfo.JobRoles.CanImplement;

            return Json(userInfo, JsonRequestBehavior.AllowGet);
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

        //Count at Dashboard
        public ActionResult GetCmdCount()
        {
            var cmdCount = _context.ChangeManagements.Count(c => c.IsImplemented != true && c.DeletedAt == null);

            return Json(cmdCount, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetForApprovalCount()
        {
            var userId = User.Identity.GetUserId();
            var userInfo = _context.Users.SingleOrDefault(u => u.Id == userId);

            var cmdList = _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null).OrderBy(c => c.TargetImplementation).ToList();

            var cmdForApprovalCount = new List<int>();

            foreach (var cmdListItem in cmdList)
            {
                if (cmdListItem.IsApproved) continue;

                var jsonSignOff = cmdListItem.SignOff;
                dynamic dynObj = JsonConvert.DeserializeObject(jsonSignOff);

                foreach (var dynObjItem in dynObj)
                {
                    if (!dynObjItem["Id"].ToString().Equals(userId)) continue;
                    if (dynObjItem["Approved"].ToString().Equals("true")) continue;
                    cmdForApprovalCount.Add(cmdListItem.Id);
                    break;
                }
            }

            return Json(cmdForApprovalCount.Count, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetForImplementationCount()
        {
            var cmdListReadyForImplementation = _context.ChangeManagements.Where(c => c.IsImplemented != true && c.DeletedAt == null && c.IsApproved).OrderBy(c => c.TargetImplementation).ToList().Count;

            return Json(cmdListReadyForImplementation, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetImplementedCmdCount()
        {
            var implementedCmdCount =
                _context.ChangeManagements.Count(c => c.IsImplemented && c.DeletedAt == null);

            return Json(implementedCmdCount, JsonRequestBehavior.AllowGet);
        }

        //History
        public ActionResult GetAllCreatedHistory()
        {
            var userId = User.Identity.GetUserId();

            var cmdList = _context.ChangeManagements.Where(c => c.RequestorId == userId && c.DeletedAt == null && c.IsImplemented).OrderBy(c => c.TargetImplementation).ToList();

            return Json(cmdList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetAllForApprovalHistory()
        {
            var userId = User.Identity.GetUserId();

            var cmdList = _context.ChangeManagements.Where(c => c.DeletedAt == null).OrderBy(c => c.TargetImplementation).ToList();

            var cmdIdListApproved = new List<int>();

            foreach (var cmdListItem in cmdList)
            {
                var jsonSignOff = cmdListItem.SignOff;
                dynamic dynObj = JsonConvert.DeserializeObject(jsonSignOff);

                foreach (var dynObjItem in dynObj)
                {
                    if (!dynObjItem["Id"].ToString().Equals(userId)) continue;
                    if (dynObjItem["Approved"].ToString().Equals("false")) continue;
                    if (dynObjItem["Id"].ToString().Equals(userId) ||
                        (dynObjItem["Id"].ToString().Equals(userId) && (cmdListItem.IsApproved ||
                            cmdListItem.IsImplemented)))
                    {
                        cmdIdListApproved.Add(cmdListItem.Id);
                        break;
                    }
                }
            }

            var cmdListHistory = _context.ChangeManagements.Where(c => cmdIdListApproved.Contains(c.Id) && c.DeletedAt == null).OrderBy(c => c.TargetImplementation).ToList();

            return Json(cmdListHistory, JsonRequestBehavior.AllowGet);
        }

        //Charts
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

        //Calendar
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