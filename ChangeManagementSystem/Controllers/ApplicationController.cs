using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChangeManagementSystem.Controllers
{
    public class ApplicationController : Controller
    {
        // GET: Application
        public ActionResult All()
        {
            ViewBag.Current = "Manage Application";
            return View("AllApplication");
        }
    }
}