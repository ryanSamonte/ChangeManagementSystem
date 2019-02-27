using ChangeManagementSystem.Models;
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

        public ActionResult Save(JobRoleModels jobRoleModel)
        {
            _context.JobRoles.Add(jobRoleModel);

            _context.SaveChanges();

            return RedirectToAction("All");
        }
    }
}