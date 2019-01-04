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

namespace ChangeManagementSystem.Controllers
{
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
            String r = generator.Next(0, 99999).ToString("D5");

            cmdModel.CmdNo = "CMD-" + DateTime.Now.Year.ToString() + "-" + r;
            cmdModel.CreatedAt = DateTime.Now;
            cmdModel.UpdatedAt = DateTime.Now;
            cmdModel.DeletedAt = null;
            cmdModel.Requestor = "Kobe Bryant- Shooting Guard";
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
            var CmdList = _context.ChangeManagements.ToList();

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
                _context.Entry(cmdRecord).State = EntityState.Deleted;
                _context.SaveChanges();
            }

            return RedirectToAction("All");
        }

        public ActionResult ExportCmd(int id)
        {
            var from = DateTime.Parse("10/01/2011");

            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports/CmdReport.rpt")));

            rd.SetDataSource(_context.ChangeManagements.Where(c => c.Id == id).Select(c => new
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
            }).ToList());
            
            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();


            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream, "application/pdf", DateTime.UtcNow.ToShortDateString()+".pdf");  
        }
    }
}