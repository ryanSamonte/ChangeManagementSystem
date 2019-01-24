$(document).ready(function () {
    $("#signOffName").autocomplete({
        source: function (request, response) {
            var role = "";
            $.ajax({
                url: "/Cmd/UserList",
                type: "POST",
                dataType: "json",
                data: { Prefix: request.term },
                success: function (data) {
                    response($.map(data, function (item) {
                        return {
                            label: item.Firstname + " " + item.Lastname + " ~ " + item.JobRoleName,
                            value: item.Firstname + " " + item.Lastname + " ~ " + item.JobRoleName,
                        };
                    }))
                }
            })
        }
    });

    $('#affectedAreasTable').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#affectedAreasTableView').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#affectedAreasTableViewCalendar').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#affectedAreasTableEdit').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#signOffTable').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#signOffTableView').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#signOffTableViewCalendar').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $('#signOffTableEdit').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });    

    getList();

    getHistoryList();

    getAccountList();

    getLatestCmdList();


    //calendar configuration
    $('#calendarCont').fullCalendar({
        header: {
            left:   'title',
            center: '',
            right:  'month prev,next'
        },
        
        buttonText:{
            today:    'today',
            month:    'Monthly View',
        },
        eventSources: [
            {
                url: '/Cmd/GetChangesImplemented',
                type: 'GET',
                data: {
                },
                success: function (data) {

                },
                error: function () {
                    alert('there was an error while fetching events!');
                },

                color: '#2472d2',
                textColor: '#e3e7fa'
            },
            {
                url: '/Cmd/GetChangesUnImplemented',
                type: 'GET',
                data: {
                },
                success: function (data) {

                },
                error: function () {
                    alert('there was an error while fetching events!');
                },

                color: '#2472d2',
                textColor: '#e3e7fa'
            }
        ],

        eventClick: function(event, element) {
            $("#viewCmdInfoModalCalendar").modal("show");

            var id = event.areas;

            $("#btnGenerateCalendar").attr("data-generate-id", id);

            var t = $('#affectedAreasTableViewCalendar').DataTable();
            var t1 = $('#signOffTableViewCalendar').DataTable();

            $.ajax({
                type: "GET",
                url: "/Cmd/Find?id=" + id,
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
                    var targetImplementationDate = nowDate.format("ddd mmm dd, yyyy HH:MM");
                    $("#targetImplementationViewCalendar").val(targetImplementationDate);
                    $("#requestorViewCalendar").val(cmdDetails.ApplicationUser.Firstname + " " + cmdDetails.ApplicationUser.Lastname);


                    var j;
                    var resultSignOff = {};
                    for (j = 0; j < signOffDetails.length; j++) {
                        var objectInResponse = signOffDetails[j];
                        var name = objectInResponse.Name
                        var role = objectInResponse.Role

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

        timezone: 'local',
        eventLimit: true,
        eventLimitText: "more implementation",
        eventLimitClick: "agendaDay",
        views: {
            month: {
                eventLimit: 5
            },
            agendaDay: {
                type: 'agenda',
                duration: { days: 1 },
                buttonText: '1 day'
            }
        }
    });

    //validations
    $.validator.addMethod("futureDate", function (value, element) {
        var curDate = new Date();
        var inputDate = new Date(value);
        if (inputDate > curDate)
            return true;
        return false;
    }, "Invalid Date!");

    $("#newChangeDocumentForm").validate({
        onkeyup: false,
        onsubmit: false,
        rules: {
            ChangeObjective: {
                required: true
            },

            ChangeType: {
                required: true
            },

            ChangeRequirements: {
                required: true
            },

            evaluationRadio: {
                required: true
            },

            TargetImplementation: {
                required: true,
                futureDate: true
            }
        },

        messages: {
            ChangeObjective: {
                required: "Objective is required"
            },

            ChangeType: {
                required: "Type is required"
            },

            ChangeRequirements: {
                required: "Requirements is required"
            },

            evaluationRadio: {
                required: "Evaluation is required"
            },

            TargetImplementation: {
                required: "Implementation date is required",
                futureDate: "Invalid date input"
            }
        },

        highlight: function (input) {
            $(input).addClass('error');
        },
        unhighlight: function (input) {
            $(input).removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });

    $("#editChangeDocumentForm").validate({
        onkeyup: false,
        onsubmit: false,
        rules: {
            changeObjectiveEdit: {
                required: true
            },

            changeTypeEdit: {
                required: true
            },

            changeRequirementEdit: {
                required: true
            },

            evaluationRadioEdit: {
                required: true
            },

            targetImplementationEdit: {
                required: true
            }
        },

        messages: {
            changeObjectiveEdit: {
                required: "Objective is required"
            },

            changeTypeEdit: {
                required: "Type is required"
            },

            changeRequirementEdit: {
                required: "Requirements is required"
            },

            evaluationRadioEdit: {
                required: "Evaluation is required"
            },

            targetImplementationEdit: {
                required: "Implementation date is required"
            }
        },

        highlight: function (input) {
            $(input).addClass('error');
        },
        unhighlight: function (input) {
            $(input).removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });

    $("#newUserAccountForm").validate({
        onkeyup: false,
        onsubmit: false,
        rules: {
            Lastname: {
                required: true
            },

            Firstname: {
                required: true
            },

            Email: {
                required: true
            },

            Password: {
                required: true
            },

            ConfirmPassword: {
                required: true,
                equalTo: "#Password"
            },

            JobRole: {
                required: true
            },

            AccountRole: {
                required: true
            }
        },

        messages: {
            Lastname: {
                required: "Lastname is required"
            },

            Firstname: {
                required: "Firstname is required"
            },

            Email: {
                required: "Email address is required"
            },

            Password: {
                required: "Password is required"
            },

            ConfirmPassword: {
                required: "Password confirmation is required",
                equalTo: "Password is not the same"
            },

            JobRole: {
                required: "Job role is required"
            },

            AccountRole: {
                required: "Account role is required"
            }
        },

        highlight: function (input) {
            $(input).addClass('error');
        },
        unhighlight: function (input) {
            $(input).removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
            //$(element).parents('.radio-inline').append(error);
        }
    });
});

$(document).ready(function () {
    var t = $('#affectedAreasTable').DataTable();

    $('#insertAffectedArea').on('click', function () {
        if ($("#affectedAreasApp").val() === "" && $("#affectedAreasDb").val() === "" && $("#affectedAreasServer").val() === "") {
            console.log("");
        }
        else {
            t.row.add([
                $('#affectedAreasApp').val(),
                $('#affectedAreasDb').val(),
                $('#affectedAreasServer').val()
            ]).draw(false);
        }
    });

    var t1 = $('#signOffTable').DataTable();

    $('#insertSignOff').on('click', function () {
        if ($("#signOffName").val() === "") {
            console.log("");
        }
        else {
            t1.row.add([
                $('#signOffName').val().substring(0, $('#signOffName').val().indexOf("~")),
                $('#signOffName').val().substring($('#signOffName').val().indexOf("~") + 1, $('#signOffName').val().length)
            ]).draw(false);
        }
    });
});

$(document).on("click", "#undoAffectedArea", function () {
    var table = $('#affectedAreasTable').DataTable();

    table.row((table.data().count() / 3) - 1).remove().draw();
});

$(document).on("click", "#undoSignOff", function () {
    var table = $('#signOffTable').DataTable();

    table.row((table.data().count() / 2) - 1).remove().draw();
});

$(document).on("hide.bs.modal", "#viewCmdInfoModal", function () {
    var t = $('#affectedAreasTableView').DataTable();

    t.clear().draw();

    var t1 = $('#signOffTableView').DataTable();

    t1.clear().draw();
});

$(document).on("hide.bs.modal", "#viewCmdInfoModalCalendar", function () {
    var t = $('#affectedAreasTableViewCalendar').DataTable();

    t.clear().draw();

    var t1 = $('#signOffTableViewCalendar').DataTable();

    t1.clear().draw();
});

$(document).on("hide.bs.modal", "#editCmdInfoModal", function () {
    var t = $('#affectedAreasTableEdit').DataTable();

    t.clear().draw();

    var t1 = $('#signOffTableEdit').DataTable();

    t1.clear().draw();
});

$(document).on("click", "#btnSave", function () {
    var changeEvaluation = 0;
    var type = 0;

    $("input[id=correctivePatchRadio]:checked").val() == "on" ? type = 1 :  type = 2;

    $("input[id=highRadio]:checked").val() == "on" ? changeEvaluation = 1 : ($("input[id=mediumRadio]:checked").val() == "on" ? changeEvaluation = 2 : changeEvaluation = 3);

    if ($("#newChangeDocumentForm").valid()) {
        $.ajax({
            method: "POST", //HTTP POST Method
            url: "/Cmd/Save",
            data: {
                ChangeObjective: $("#changeObjective").val(),
                ChangeType: type,
                ChangeRequirements: $("#changeRequirements").val(),
                AffectedAreas: JSON.stringify(tableToJSON($("#affectedAreasTable"))),
                ChangeEvaluation: changeEvaluation,
                TargetImplementation: $("#targetImplementation").val(),
                __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newChangeDocumentForm").val(),
                SignOff: JSON.stringify(tableToJSON($("#signOffTable"))),
            },
            success: function (da) {
                $.notify({
                    icon: "pe-7s-check",
                    message: "Change Management Document successfully recorded!"

                }, {
                    type: 'success',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });

                clearInputsNewCmd();
            },
            error: function (da) {
                $.notify({
                    icon: "pe-7s-close-circle",
                    message: "Error"

                }, {
                    type: 'danger',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });
            }
        });
    }

    return false;

});

$(document).on("click", "#btnView", function () {
    $("#viewCmdInfoModal").focus();

    var id = $(this).attr("data-id");

    $("#btnGenerate").attr("data-generate-id", id);

    var t = $('#affectedAreasTableView').DataTable();
    var t1 = $('#signOffTableView').DataTable();

    $.ajax({
        type: "GET",
        url: "/Cmd/Find?id=" + id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);

            var cmdDetails = JSON.parse(jsonStringified);

            var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

            var signOffDetails = JSON.parse(cmdDetails.SignOff);

            $("#changeObjectiveView").val(cmdDetails.ChangeObjective);
            $("#changeTypeView").val(cmdDetails.ChangeType);
            $("#changeRequirementView").val(cmdDetails.ChangeRequirements);

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
            $("#requestEvaluationView").val((cmdDetails.ChangeEvaluation == 1 ? "High" : (cmdDetails.ChangeEvaluation == 2 ? "Medium" : "Low")));
            var nowDate = new Date(parseInt(cmdDetails.TargetImplementation.substr(6)));
            var targetImplementationDate = nowDate.format("ddd mmm dd, yyyy HH:MM");
            $("#targetImplementationView").val(targetImplementationDate);
            $("#requestorView").val(cmdDetails.ApplicationUser.Firstname + " " + cmdDetails.ApplicationUser.Lastname);


            var j;
            var resultSignOff = {};
            for (j = 0; j < signOffDetails.length; j++) {
                var objectInResponse = signOffDetails[j];
                var name = objectInResponse.Name
                var role = objectInResponse.Role

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
});

$(document).on("click", "#btnGenerate", function () {
    var id = $(this).attr("data-generate-id")
    window.location.href = "/Cmd/ExportCmd?id=" + id
});


$(document).on("click", "#btnEdit", function () {
    $("#editCmdInfoModal").focus();

    var id = $(this).attr("data-id");

    $("#btnUpdate").attr("data-edit-id", id);

    var t = $('#affectedAreasTableEdit').DataTable();
    var t1 = $('#signOffTableEdit').DataTable();

    $.ajax({
        type: "GET",
        url: "/Cmd/Find?id=" + id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);

            var cmdDetails = JSON.parse(jsonStringified);

            var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

            var signOffDetails = JSON.parse(cmdDetails.SignOff);

            $("#changeObjectiveEdit").val(cmdDetails.ChangeObjective);
            $("#changeTypeEdit").val(cmdDetails.ChangeType);
            $("#changeRequirementEdit").val(cmdDetails.ChangeRequirements);

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
            console.log(cmdDetails.ChangeEvaluation);
            $("#requestEvaluationEdit").val((cmdDetails.ChangeEvaluation == 1 ? $("#highRadioEdit").prop("checked", true) : (cmdDetails.ChangeEvaluation == 2 ? $("#mediumRadioEdit").prop("checked", true) : $("#lowRadioEdit").prop("checked", true))));
            var nowDate = new Date(parseInt(cmdDetails.TargetImplementation.substr(6)));
            var targetImplementationDate = nowDate.format("yyyy-mm-dd'T'HH:MM:ss");
            $("#targetImplementationEdit").val(targetImplementationDate);


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
});

$(document).on("click", "#btnUpdate", function () {
    var id = $(this).attr("data-edit-id");

    var changeEvaluation = 0;

    $("input[id=highRadioEdit]:checked").val() == "on" ? changeEvaluation = 1 : ($("input[id=mediumRadioEdit]:checked").val() == "on" ? changeEvaluation = 2 : changeEvaluation = 3);

    if ($("#editChangeDocumentForm").valid()) {
        $.ajax({
            method: "POST", //HTTP POST Method
            url: "/Cmd/Update?id=" + id,
            data: {
                ChangeObjective: $("#changeObjectiveEdit").val(),
                ChangeType: $("#changeTypeEdit").val(),
                ChangeRequirements: $("#changeRequirementEdit").val(),
                AffectedAreas: JSON.stringify(tableToJSON($("#affectedAreasTableEdit"))),
                ChangeEvaluation: changeEvaluation,
                TargetImplementation: $("#targetImplementationEdit").val(),
                SignOff: JSON.stringify(tableToJSON($("#signOffTableEdit"))),
                __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#editChangeDocumentForm").val(),
            },
            success: function (da) {
                var table = $("#cmdList").DataTable();

                $.notify({
                    icon: "pe-7s-check",
                    message: "Change Management Document successfully updated!"

                }, {
                    type: 'success',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });

                clearInputsNewCmd();
                $("#editCmdInfoModal .close").click();
                table.destroy();
                getList();
            },
            error: function (da) {
                $.notify({
                    icon: "pe-7s-close-circle",
                    message: "Error"

                }, {
                    type: 'danger',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });
            }
        });
    }

    return false;

});


$(document).on("click", "#btnDelete", function () {
    var id = $(this).attr("data-id");

    if (confirm("Are you sure you want to delete this record?") == true) {
        $.ajax({
            method: "POST",
            url: "/Cmd/Delete?id=" + id,
            success: function(da){
                redrawDt();
            },
            error: function (da) {
                alert('Error encountered!');
            }
        });
    }
    else
        return false;
});

$(document).on("click", "#btnImplement", function () {
    var id = $(this).attr("data-id");

    if (confirm("Are you sure to set this Change Document as implemented?") == true) {
        $.ajax({
            method: "POST",
            url: "/Cmd/Implement?id=" + id,
            success: function (da) {
                redrawDt();
            },
            error: function (da) {
                alert('Error encountered!');
            }
        });
    }
    else
        return false;
});

$(document).on("click", "#btnInsertAccount", function () {
    if ($("#newUserAccountForm").valid()) {
        $.ajax({
            method: "POST",
            url: "/Account/Register",
            data: {
                Lastname: $("#Lastname").val(),
                Firstname: $("#Firstname").val(),
                UserName: $("#Email").val(),
                Email: $("#Email").val(),
                Password: $("#Password").val(),
                ConfirmPassword: $("#ConfirmPassword").val(),
                JobRoleId: $("#JobRole").val(),
                AccountRole: $("#AccountRole").val(),
                __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newUserAccountForm").val(),
            },
            success: function (da) {
                var table = $("#accountList").DataTable();

                $.notify({
                    icon: "pe-7s-check",
                    message: "User account successfully added!"

                }, {
                    type: 'success',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });

                clearInputsNewCmd();
                $("#insertUserAccountModal .close").click();
                table.destroy();
                getAccountList();
            },
            error: function (da) {
                $.notify({
                    icon: "pe-7s-close-circle",
                    message: "Error"

                }, {
                    type: 'danger',
                    timer: 4000,
                    placement: {
                        from: "bottom",
                        align: "right"
                    }
                });
            }
        });
    }

    return false;

});

function tableToJSON(tblObj) {
    var data = [];
    var $headers = $(tblObj).find("th");
    var $rows = $(tblObj).find("tbody tr").each(function (index) {
        $cells = $(this).find("td");
        data[index] = {};
        $cells.each(function (cellIndex) {
            data[index][$($headers[cellIndex]).html()] = $(this).html();
        });
    });
    return data;
}

function getList() {
    var table = $("#cmdList").DataTable({
        ajax: {
            url: "/Cmd/GetAll",
            dataSrc: "",
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full, meta) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
                
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data == 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data == 1 ? "High" : (data == 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy HH:MM");
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-fill btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView' value='View' style='width:100%;'/>";
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-fill btn-warning editButton' data-id=" + data + " data-toggle='modal' data-target='#editCmdInfoModal' name='editButton' id='btnEdit' value='Edit' style='width:100%;'/>";
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-fill btn-success implementButton' data-id=" + data + " name='implementButton' id='btnImplement' value='Set as Implemented' style='width:100%;'/>";
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<input type='button' class='btn btn-fill btn-danger deleteButton' data-id=" + data + " name='deleteButton' id='btnDelete' value='Delete' style='width:100%;'/>";
                }
            }
        ]
    });
}

function getHistoryList() {
    var table = $("#cmdHistoryList").DataTable({
        ajax: {
            url: "/Cmd/GetAllHistory",
            dataSrc: "",
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full, meta) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data == 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data == 1 ? "High" : (data == 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy HH:MM");
                }
            },
            {
                data: "ImplementedAt",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy HH:MM");
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-fill btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView' value='View' style='width:100%;'/>";
                }
            }
        ]
    });
}

function getAccountList() {
    var table = $("#accountList").DataTable({
        ajax: {
            url: "/Account/GetAll",
            dataSrc: "",
        },
        columns: [
            {
                data: "Lastname",
                render: function (data, type, full, meta) {
                    return full.Firstname + " " + full.Lastname;
                }
            },
            {
                data: "Email"
            },
            {
                data: "JobRoles.JobRoleName"
            }
        ]
    });
}


function getLatestCmdList() {
    var table = $("#latestCmdTable").DataTable({
        "paging": false,
        "ordering": false,
        "info": false,

        ajax: {
            url: "/Cmd/GetAllIncoming",
            dataSrc: "",
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full, meta) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
                
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data == 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data == 1 ? "High" : (data == 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy HH:MM");
                }
            },
            {
                data: "Id",
                render: function (data) {

                    return "<input type='button' class='btn btn-fill btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView' value='View' style='width:100%;'/>";
                }
            }
        ]
    });
}

function clearInputsNewCmd() {
    var t = $('#affectedAreasTable').DataTable();
    var t1 = $('#signOffTable').DataTable();

    $("#changeObjective").val("");
    $("#changeType").val(1);
    $("#changeRequirements").val("");
    $('#affectedAreasApp').val("");
    $('#affectedAreasDb').val("");
    $('#affectedAreasServer').val("");
    t.clear().draw();
    $("#highRadio").prop('checked', false);
    $("#mediumRadio").prop('checked', false);
    $("#lowRadio").prop('checked', false);
    $("#targetImplementation").val("");
    $('#signOffName').val("");
    $('#signOffRole').val("");
    t1.clear().draw();
}

function redrawDt() {
    var table = $("#cmdList").DataTable();

    table.row($("#btnDelete").parents("tr")).remove().draw();
}