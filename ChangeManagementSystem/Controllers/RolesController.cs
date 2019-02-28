using ChangeManagementSystem.Models;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    public class RolesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RolesController()
        {
            _context = new ApplicationDbContext(); ;
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        // GET: Roles
        public ActionResult All()
        {
            ViewBag.Current = "Manage Job Roles";

            return View("AllRoles");
        }

        public JsonResult GetAll()
        {
            var rolesList = _context.JobRoles.ToList();

            return Json(rolesList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Find(int id)
        {
            var role = _context.JobRoles.SingleOrDefault(r => r.Id == id);

            return Json(role, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Save(JobRoleModels jobRoleModel)
        {
            _context.JobRoles.Add(jobRoleModel);

            _context.SaveChanges();

            return RedirectToAction("All");
        }

        public ActionResult Update(JobRoleModels jobRoleModel, int id)
        {
            _context.Entry(jobRoleModel).State = EntityState.Modified;

            _context.SaveChanges();

            return RedirectToAction("All");
        }
    }
}