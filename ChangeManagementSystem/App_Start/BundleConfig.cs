﻿using System.Web.Optimization;

namespace ChangeManagementSystem
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery.3.2.1.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/chartist").Include(
                      "~/Scripts/chartist.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/popper").Include(
                      "~/Scripts/popper.js"));

            bundles.Add(new ScriptBundle("~/bundles/tooltip").Include(
                      "~/Scripts/tooltip.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrapnotify").Include(
                      "~/Scripts/bootstrap-notify.js"));

            bundles.Add(new ScriptBundle("~/bundles/lightbootstrap").Include(
                      "~/Scripts/light-bootstrap-dashboard.js"));

            bundles.Add(new ScriptBundle("~/bundles/datatable").Include(
                      "~/Scripts/datatables.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/dateformat").Include(
                      "~/Scripts/date.format.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                      "~/Scripts/jquery-ui.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                      "~/Scripts/moment.js"));

            bundles.Add(new ScriptBundle("~/bundles/fullcalendar").Include(
                      "~/Scripts/fullcalendar.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootbox").Include(
                      "~/Scripts/bootbox.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/table-configuration").Include(
                      "~/Scripts/Function/table-configuration.js"));

            bundles.Add(new ScriptBundle("~/bundles/character-counter").Include(
                      "~/Scripts/Function/character-counter.js"));

            bundles.Add(new ScriptBundle("~/bundles/calendar-configuration").Include(
                      "~/Scripts/Function/calendar-configuration.js"));

            bundles.Add(new ScriptBundle("~/bundles/form-validation").Include(
                      "~/Scripts/Function/form-validation.js"));

            bundles.Add(new ScriptBundle("~/bundles/ChangeManagementViewModel").Include(
                      "~/ViewModels/ChangeManagementViewModel.js"));

            bundles.Add(new ScriptBundle("~/bundles/JobRoleViewModel").Include(
                      "~/ViewModels/JobRoleViewModel.js"));

            bundles.Add(new ScriptBundle("~/bundles/AccountViewModel").Include(
                      "~/ViewModels/AccountViewModel.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/animate.min.css",
                      "~/Content/light-bootstrap-dashboard.css",
                      "~/Content/datatables.min.css",
                      "~/Content/jquery-ui.css",
                      "~/Content/fullcalendar.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/peicon").Include(
                      "~/Content/pe-icon-7-stroke.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}