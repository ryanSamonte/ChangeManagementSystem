$(document).ready(function () {
    //calendar configuration
    $("#calendarCont").fullCalendar({
        header: {
            left: "title",
            center: "",
            right: "month prev,next"
        },

        buttonText: {
            today: "today",
            month: "Monthly View"
        },
        eventSources: [
            {
                url: $("#changesImplementedUrl").data("request-url"),
                type: "GET",
                data: {
                },
                success: function (data) {
                },
                error: function () {
                    alert("there was an error while fetching events!");
                },

                color: "#2472d2",
                textColor: "#e3e7fa"
            },
            {
                url: $("#changesUnimplementedUrl").data("request-url"),
                type: "GET",
                data: {
                },
                success: function (data) {
                },
                error: function () {
                    alert("there was an error while fetching events!");
                },

                color: "#2472d2",
                textColor: "#e3e7fa"
            },
            {
                url: $("#changesPastTheDeadlineUrl").data("request-url"),
                type: "GET",
                data: {
                },
                success: function (data) {
                },
                error: function () {
                    alert("there was an error while fetching events!");
                },

                color: "#2472d2",
                textColor: "#e3e7fa"
            }
        ],

        eventClick: function (event, element) {
            $("#viewCmdInfoModalCalendar").modal("show");

            var id = event.areas;

            $("#btnGenerate").attr("data-generate-id", id);

            var t = $("#affectedAreasTableViewCalendar").DataTable();
            var t1 = $("#signOffTableViewCalendar").DataTable();

            $.ajax({
                type: "GET",
                url: $("#viewCalendarCmdUrl").data("request-url") + "?id=" + id,
                success: function (data) {
                    var jsonStringified = JSON.stringify(data);

                    var cmdDetails = JSON.parse(jsonStringified);

                    var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

                    var signOffDetails = JSON.parse(cmdDetails.SignOff);

                    $("#changeObjectiveViewCalendar").val(cmdDetails.ChangeObjective);
                    $("#changeTypeViewCalendar").val(cmdDetails.ChangeType);
                    $("#changeRequirementViewCalendar").val(cmdDetails.ChangeRequirements);

                    var i;
                    var result = {};
                    for (i = 0; i < affectedAreaDetails.length; i++) {
                        var objectInResponse = affectedAreaDetails[i];
                        var application = objectInResponse.Application;
                        var database = objectInResponse.Database;
                        var server = objectInResponse.Server;

                        t.row.add([
                            application,
                            database,
                            server
                        ]).draw(false);
                    }
                    $("#requestEvaluationViewCalendar").val((cmdDetails.ChangeEvaluation == 1 ? "High" : (cmdDetails.ChangeEvaluation == 2 ? "Medium" : "Low")));

                    var nowDate = new Date(parseInt(cmdDetails.TargetImplementation.substr(6)));
                    var targetImplementationDate = nowDate.format("ddd mmm dd, yyyy hh:MM tt");
                    $("#targetImplementationViewCalendar").val(targetImplementationDate);

                    if (cmdDetails.ImplementedAt == null) {
                        $("#implementedAtViewCalendar").val(null);
                    } else {
                        var implementedAt = new Date(parseInt(cmdDetails.ImplementedAt.substr(6)));
                        var implementationDate = implementedAt.format("ddd mmm dd, yyyy hh:MM tt");
                        $("#implementedAtViewCalendar").val(implementationDate);
                    }

                    $("#requestorViewCalendar").val(cmdDetails.ApplicationUser.Firstname + " " + cmdDetails.ApplicationUser.Lastname);

                    var j;
                    var resultSignOff = {};
                    for (j = 0; j < signOffDetails.length; j++) {
                        var objectInResponse = signOffDetails[j];
                        var name = objectInResponse.Name;
                        var role = objectInResponse.Role;
                        t1.row.add([
                            name,
                            role
                        ]).draw(false);
                    }
                },
                error: function () {
                    alert("Error while retrieving data of :" + id);
                }
            });
        },

        timezone: "local",
        eventLimit: true,
        eventLimitText: "more implementation",
        eventLimitClick: "agendaDay",
        views: {
            month: {
                eventLimit: 5
            },
            agendaDay: {
                type: "agenda",
                duration: { days: 1 },
                buttonText: "1 day"
            }
        }
    });
});