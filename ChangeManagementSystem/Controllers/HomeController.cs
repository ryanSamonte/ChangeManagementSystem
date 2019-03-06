using ChangeManagementSystem.Models;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
        }

        public ActionResult Index()
        {
            ViewBag.Current = "Dashboard";

            var userId = User.Identity.GetUserId();
            var userInfo = _context.Users.SingleOrDefault(u => u.Id == userId);

            if (userInfo != null) ViewBag.CanImplementStatus = userInfo.JobRoles.CanImplement;

            return View();
        }
    }
}