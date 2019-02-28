using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    public class HomeController : Controller
    {
        [Authorize]
        public ActionResult Index()
        {
            ViewBag.Current = "Dashboard";

            return View();
        }
    }
}