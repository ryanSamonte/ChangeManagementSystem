using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ChangeManagementSystem.Models;
using ChangeManagementSystem;
using System.Data.Entity;
using CrystalDecisions.CrystalReports.Engine;
using System.IO;
using System.Globalization;
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Save(ChangeManagementModels cmdModel)
        {
            Random generator = new Random();
            //String r = generator.Next(0, 99999).ToString("D5");

            string r = DateTime.UtcNow.ToLocalTime().Hour.ToString() + DateTime.UtcNow.ToLocalTime().Minute.ToString() + DateTime.UtcNow.ToLocalTime().Second.ToString(); 

            cmdModel.CmdNo = "CMD-" + DateTime.Now.Year.ToString() + "-" + r;
            cmdModel.CreatedAt = DateTime.Now;
            cmdModel.UpdatedAt = DateTime.Now;
            cmdModel.DeletedAt = null;
            cmdModel.ImplementedAt = null;
            cmdModel.Requestor = "Kobe Bryant- Shooting Guard";
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

            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports/CmdReport.rpt")));

            var cmdModel = new List<AffectedAreasModels>();
            string jsonAffectedArea = "";
            string jsonSignOff = "";

            var appList = new List<string>();
            var dbList = new List<string>();
            var serverList = new List<string>();

            var signoffReviewedByList = new List<string>();
            var signoffSignatureList = new List<string>();
            var signoffInfoList = new List<string>();
            var signoffRoleList = new List<string>();
            var signoffDateList = new List<string>();

            cmdModel = _context.ChangeManagements.Where(c => c.Id == id).Select(c => new AffectedAreasModels()
            {
                CmdNo = c.CmdNo,
                ChangeObjective = c.ChangeObjective,
                ChangeType = c.ChangeType,
                ChangeRequirements = c.ChangeRequirements,
                AffectedAreas = c.AffectedAreas,
                ChangeEvaluation = c.ChangeEvaluation,
                TargetImplementation = c.TargetImplementation,
                Requestor = c.Requestor,
                SignOff = c.SignOff,
                CreatedAt = c.CreatedAt ?? from,
                UpdatedAt = c.UpdatedAt ?? from,
                DeletedAt = c.DeletedAt ?? from,
            }).ToList();

            foreach (var cmdModelItem in cmdModel)
            {
                jsonAffectedArea = cmdModelItem.AffectedAreas;
                jsonSignOff = cmdModelItem.SignOff;
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

            rd.SetParameterValue("SignOffInfo", signoffInfoValue);
            
            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();

            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream, "application/pdf", DateTime.UtcNow.ToShortDateString() + "_" + DateTime.UtcNow.ToLocalTime().ToShortTimeString() + ".pdf");
        }

        public ActionResult History()
        {
            ViewBag.Current = "Change Document History";

            return View("HistoryCmd");
        }

        public ActionResult GetAllHistory()
        {
            var cmdListHistory = _context.ChangeManagements.Where(c => c.IsImplemented == true && c.DeletedAt == null).ToList();

            return Json(cmdListHistory, JsonRequestBehavior.AllowGet);
        }
    }
}