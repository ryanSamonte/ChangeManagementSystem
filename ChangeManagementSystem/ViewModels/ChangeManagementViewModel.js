﻿$(document).ready(function () {
    var canImplement = true;

    getLoggedUserInfo();

    getList();

    getListApproval();

    getHistoryListCreated();

    getHistoryListApproval();

    getLatestCmdList();

    $(document).on("click", "#btnSave", function () {
        var changeEvaluation;
        var type;

        $("input[id=correctivePatchRadio]:checked").val() === "on" ? type = 1 : type = 2;

        $("input[id=highRadio]:checked").val() === "on" ? changeEvaluation = 1 : ($("input[id=mediumRadio]:checked").val() === "on" ? changeEvaluation = 2 : changeEvaluation = 3);

        if ($("#newChangeDocumentForm").valid() && $("#affectedAreasTable").DataTable().rows().count() > 0 && $("#signOffTable").DataTable().rows().count() > 0) {
            $.ajax({
                method: "POST", //HTTP POST Method
                url: $("#insertNewCmdUrl").data("request-url"),
                data: {
                    ChangeObjective: $("#changeObjective").val(),
                    ChangeType: type,
                    ChangeRequirements: $("#changeRequirements").val(),
                    AffectedAreas: JSON.stringify(tableToJSON($("#affectedAreasTable"))),
                    ChangeEvaluation: changeEvaluation,
                    TargetImplementation: $("#targetImplementation").val(),
                    __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newChangeDocumentForm").val(),
                    SignOff: JSON.stringify(tableToJSON($("#signOffTable")))
                },
                success: function () {
                    $.notify({
                        icon: "pe-7s-check",
                        message: "Change Management Document successfully recorded!"
                    }, {
                        type: "success",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });

                    clearInputsNewCmd();
                },
                error: function () {
                    $.notify({
                        icon: "pe-7s-close-circle",
                        message: "Error"
                    }, {
                        type: "danger",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });
                }
            });
        }
        if ($("#affectedAreasTable").DataTable().rows().count() === 0) {
            $("#affectedAreaErrorNew").show();
        }
        if ($("#signOffTable").DataTable().rows().count() === 0) {
            $("#signOffErrorNew").show();
        }
        return false;
    });

    $(document).on("click", "#btnView", function () {
        $("#viewCmdInfoModal").focus();

        var id = $(this).attr("data-id");

        $("#btnGenerate").attr("data-generate-id", id);

        var t = $("#affectedAreasTableView").DataTable();
        var t1 = $("#signOffTableView").DataTable();

        $.ajax({
            type: "GET",
            url: $("#viewCmdUrl").data("request-url") + "?id=" + id,
            success: function (data) {
                var jsonStringified = JSON.stringify(data);

                var cmdDetails = JSON.parse(jsonStringified);

                var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

                var signOffDetails = JSON.parse(cmdDetails.SignOff);

                $("#cmdNoHistory").html("<h5 class='small text-muted' style='display: inline-block; color: #fff;'>(" + cmdDetails.CmdNo + ")</h5>");
                $("#changeObjectiveView").val(cmdDetails.ChangeObjective);
                $("#changeTypeView").val(cmdDetails.ChangeType);
                $("#changeRequirementView").val(cmdDetails.ChangeRequirements);

                var i;
                var objectInResponse;
                for (i = 0; i < affectedAreaDetails.length; i++) {
                    objectInResponse = affectedAreaDetails[i];
                    var application = objectInResponse.Application;
                    var database = objectInResponse.Database;
                    var server = objectInResponse.Server;

                    t.row.add([
                        application,
                        database,
                        server
                    ]).draw(false);
                }
                $("#requestEvaluationView").val((cmdDetails.ChangeEvaluation === 1 ? "High" : (cmdDetails.ChangeEvaluation === 2 ? "Medium" : "Low")));

                var nowDate = new Date(parseInt(cmdDetails.TargetImplementation.substr(6)));
                var targetImplementationDate = nowDate.format("ddd mmm dd, yyyy hh:MM tt");
                $("#targetImplementationView").val(targetImplementationDate);

                if (cmdDetails.ImplementedAt == null) {
                    $("#implementedAtViewCalendar").val(null);
                } else {
                    var implementedAt = new Date(parseInt(cmdDetails.ImplementedAt.substr(6)));
                    var implementationDate = implementedAt.format("ddd mmm dd, yyyy hh:MM tt");
                    $("#implementedAtView").val(implementationDate);
                }

                $("#requestorView").val(cmdDetails.ApplicationUser.Firstname + " " + cmdDetails.ApplicationUser.Lastname);

                var j;
                for (j = 0; j < signOffDetails.length; j++) {
                    objectInResponse = signOffDetails[j];
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

    $(document).on("click", "#btnGenerate", function () {
        var id = $(this).attr("data-generate-id");

        window.location.href = $("#exportCmdUrl").data("request-url") + "?id=" + id;
    });

    $(document).on("click", "#btnEdit", function () {
        $("#editCmdInfoModal").focus();

        var nMaxLength = 2000;

        var nRemainingObjective = nMaxLength - $("#changeObjectiveEdit").val().length;
        $(".remainingObjectiveEdit").text(nRemainingObjective);

        var nRemainingRequirement = nMaxLength - $("#changeRequirementEdit").val().length;
        $(".remainingRequirementsEdit").text(nRemainingRequirement);

        var id = $(this).attr("data-id");

        $("#btnUpdate").attr("data-edit-id", id);

        var t = $("#affectedAreasTableEdit").DataTable();
        var t1 = $("#signOffTableEdit").DataTable();

        $.ajax({
            type: "GET",
            url: $("#viewCmdUrl").data("request-url") + "?id=" + id,
            success: function (data) {
                var jsonStringified = JSON.stringify(data);

                var cmdDetails = JSON.parse(jsonStringified);

                var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

                var signOffDetails = JSON.parse(cmdDetails.SignOff);

                $("#cmdNoEdit").html("<h5 class='small text-muted' style='display: inline-block; color: #fff;'>(" + cmdDetails.CmdNo + ")</h5>");
                $("#changeObjectiveEdit").val(cmdDetails.ChangeObjective);
                console.log("Type:" + cmdDetails.ChangeType);
                $("#changeTypeEdit").val(cmdDetails.ChangeType === 1 ? $("#correctivePatchRadioEdit").prop("checked", true) : $("#newFunctionRadioEdit").prop("checked", true));
                $("#changeRequirementEdit").val(cmdDetails.ChangeRequirements);

                var i;
                var objectInResponse;
                for (i = 0; i < affectedAreaDetails.length; i++) {
                    objectInResponse = affectedAreaDetails[i];
                    var application = objectInResponse.Application;
                    var database = objectInResponse.Database;
                    var server = objectInResponse.Server;

                    t.row.add([
                        "<td><span class='tableContent'>" + application + "</span></td>",
                        "<td><span class='tableContent'>" + database + "</span></td>",
                        "<td><span class='tableContent'>" + server + "</span></td>"
                    ]).draw(false);
                }
                console.log(cmdDetails.ChangeEvaluation);
                $("#requestEvaluationEdit").val((cmdDetails.ChangeEvaluation === 1 ? $("#highRadioEdit").prop("checked", true) : (cmdDetails.ChangeEvaluation === 2 ? $("#mediumRadioEdit").prop("checked", true) : $("#lowRadioEdit").prop("checked", true))));
                var nowDate = new Date(parseInt(cmdDetails.TargetImplementation.substr(6)));
                var targetImplementationDate = nowDate.format("yyyy-mm-dd'T'HH:MM:ss");
                $("#targetImplementationEdit").val(targetImplementationDate);

                $("#targetImplementationTemp").val(targetImplementationDate);

                var j;
                for (j = 0; j < signOffDetails.length; j++) {
                    objectInResponse = signOffDetails[j];
                    var name = objectInResponse.Name;
                    var role = objectInResponse.Role;
                    var id = objectInResponse.Id;
                    var approve = objectInResponse.Approved;

                    t1.row.add([
                    "<td><span class='tableContent'>" + name + "</span></td>",
                    "<td><span class='tableContent'>" + role + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + id + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + approve + "</span></td>",
                    "<div class='btn-group'>" +
                    "<span data-placement='top' data-toggle='tooltip' title='Remove Row'>" +
                    "<button type='button' id='removeBtnSignOffEdit' class='btn btn-danger btn-table btn-fill btn-sm' data-toggle='' data-target='' style='width:100%;'><i class='pe-7s-close' style='font-size:20px;'></i></button>" +
                    "</span>" +
                    "</div>"
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

        var changeEvaluation;
        var type;
        $("input[id=correctivePatchRadioEdit]:checked").val() === "on" ? type = 1 : type = 2;
        $("input[id=highRadioEdit]:checked").val() === "on" ? changeEvaluation = 1 : ($("input[id=mediumRadioEdit]:checked").val() === "on" ? changeEvaluation = 2 : changeEvaluation = 3);

        if ($("#editChangeDocumentForm").valid() && $("#affectedAreasTableEdit").DataTable().rows().count() > 0 && $("#signOffTableEdit").DataTable().rows().count() > 0) {
            $.ajax({
                method: "POST", //HTTP POST Method
                url: $("#updateCmdUrl").data("request-url") + "?id=" + id,
                data: {
                    ChangeObjective: $("#changeObjectiveEdit").val(),
                    ChangeType: type,
                    ChangeRequirements: $("#changeRequirementEdit").val(),
                    AffectedAreas: JSON.stringify(tableToJSON($("#affectedAreasTableEdit"))),
                    ChangeEvaluation: changeEvaluation,
                    TargetImplementation: $("#targetImplementationEdit").val(),
                    SignOff: JSON.stringify(tableToJSON($("#signOffTableEdit"))),
                    __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#editChangeDocumentForm").val()
                },
                success: function () {
                    var table = $("#cmdList").DataTable();

                    $.notify({
                        icon: "pe-7s-check",
                        message: "Change Management Document successfully updated!"
                    }, {
                        type: "success",
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
                error: function () {
                    $.notify({
                        icon: "pe-7s-close-circle",
                        message: "Error"
                    }, {
                        type: "danger",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });
                }
            });
        }
        if ($("#affectedAreasTableEdit").DataTable().rows().count() === 0) {
            $("#affectedAreaErrorEdit").show();
        }
        if ($("#signOffTableEdit").DataTable().rows().count() === 0) {
            $("#signOffErrorEdit").show();
        }

        return false;
    });

    $(document).on("click", "#btnDelete", function () {
        var id = $(this).attr("data-id");

        bootbox.confirm({
            title: "Delete Change Management Record",
            size: "medium",
            message: "Are you sure you want to delete this record?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn btn-fill btn-danger"
                },
                cancel: {
                    label: "No",
                    className: "btn btn-fill btn-success"
                }
            },
            callback: function (result) {
                if (result === true) {
                    $.ajax({
                        method: "POST",
                        url: $("#deleteCmdUrl").data("request-url") + "?id=" + id,
                        success: function () {
                            var table = $("#cmdList").DataTable();
                            redrawDt();
                            table.destroy();
                            getList();
                        },
                        error: function () {
                            alert("Error encountered!");
                        }
                    });
                }
            }
        });
    });

    $(document).on("click", "#btnImplement", function () {
        var id = $(this).attr("data-id");

        bootbox.confirm({
            title: "Set Change Management Record as Implemented",
            size: "medium",
            message: "Are you sure to set this Change Document as implemented?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn btn-fill btn-success"
                },
                cancel: {
                    label: "No",
                    className: "btn btn-fill btn-danger"
                }
            },
            callback: function (result) {
                if (result === true) {
                    $.ajax({
                        method: "POST",
                        url: $("#implementCmdUrl").data("request-url") + "?id=" + id,
                        success: function () {
                            var table = $("#cmdListApproval").DataTable();
                            redrawDt();
                            table.destroy();
                            getListApproval();
                        },
                        error: function () {
                            alert("Error encountered!");
                        }
                    });
                }
            }
        });
    });

    $(document).on("click", "#btnApprove", function () {
        var id = $(this).attr("data-id");
        bootbox.confirm({
            title: "Approve this Change Management Record",
            size: "medium",
            message: "Are you sure you want to approve this Change Document?",
            buttons: {
                confirm: {
                    label: "Yes",
                    className: "btn btn-fill btn-success"
                },
                cancel: {
                    label: "No",
                    className: "btn btn-fill btn-danger"
                }
            },
            callback: function (result) {
                if (result === true) {
                    $.ajax({
                        method: "POST",
                        url: $("#approveCmdUrl").data("request-url") + "?id=" + id,
                        success: function () {
                            var table = $("#cmdListApproval").DataTable();
                            redrawDt();
                            table.destroy();
                            getListApproval();
                        },
                        error: function () {
                            alert("Error encountered!");
                        }
                    });
                }
            }
        });
    });
});

function tableToJSON(tblObj) {
    var data = [];
    var $headers = $(tblObj).find("th");
    $(tblObj).find("tbody tr").each(function (index) {
        var $cells = $(this).find(".tableContent");
        data[index] = {};
        $cells.each(function (cellIndex) {
            data[index][$($headers[cellIndex]).html()] = $(this).html();
        });
    });
    return data;
}

function getLoggedUserInfo() {
    $.ajax({
        url: $("#getLoggedUserUrl").data("request-url"),
        type: "GET",
        success: function (data) {
            var jsonStringified = JSON.stringify(data);
            var loggedUserDetails = JSON.parse(jsonStringified);

            canImplement = loggedUserDetails.JobRoles.CanImplement;
        }
    });
}

function getList() {
    $("#cmdList").DataTable({
        ajax: {
            url: $("#getAllCmdUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "ChangeType",
                render: function (data) {
                    return data === 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data === 1 ? "High" : (data === 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy hh:MM tt");
                }
            },
            {
                data: "IsApproved",
                render: function (data) {
                    return data === true ? "<span class='label label-success'>Ready for Implementation</span>" : "<span class='label label-danger'>Pending for Approval</span>";
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-primary btn-table viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "<span data-placement='top' data-toggle='tooltip' title='Edit Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-warning btn-table editButton' data-id=" + data + " data-toggle='modal' data-target='#editCmdInfoModal' name='editButton' id='btnEdit'><i class='pe-7s-note'></i></button>" +
                        "</span>" +
                        "<span data-placement='top' data-toggle='tooltip' title='Delete Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-danger btn-table deleteButton' data-id=" + data + " name='deleteButton' id='btnDelete'><i class='pe-7s-trash'></i></button>" +
                        "</span>" +
                        "</div>";
                }
            }
        ]
    });
}

function getListApproval() {
    $("#cmdListApproval").DataTable({
        ajax: {
            url: $("#getAllCmdApprovalUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data === 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data === 1 ? "High" : (data === 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy hh:MM tt");
                }
            },
            {
                data: "IsApproved",
                render: function (data) {
                    return data === true ? "<span class='label label-success'>Ready for Implementation</span>" : "<span class='label label-danger'>Pending for Approval</span>";
                }
            },
            {
                data: "Id",
                render: function (data, type, full) {
                    return canImplement === true ?
                        (full.IsApproved === true ?
                        "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-primary btn-table viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "<span data-placement='top' data-toggle='tooltip' title='Set as Implemented'>" +
                        "<button type='button' class='btn btn-fill btn-success btn-table implementButton' data-id=" + data + " name='implementButton' id='btnImplement'><i class='pe-7s-check'></i></button>" +
                        "</span>" +
                        "</div>"
                        :
                        "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-primary btn-table viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "<span data-placement='top' data-toggle='tooltip' title='Approve this Change Document'>" +
                        "<button type='button' class='btn btn-fill btn-approve btn-table approveButton' data-id=" + data + " data-toggle='modal' data-target='#approveCmdInfoModal' name='approveButton' id='btnApprove'><i class='pe-7s-like2'></i></button>" +
                        "</span>" +
                        "</div>"
                        )
                        :
                        "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-primary btn-table viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "<span data-placement='top' data-toggle='tooltip' title='Approve this Change Document'>" +
                        "<button type='button' class='btn btn-fill btn-approve btn-table approveButton' data-id=" + data + " data-toggle='modal' data-target='#approveCmdInfoModal' name='approveButton' id='btnApprove'><i class='pe-7s-like2'></i></button>" +
                        "</span>" +
                        "</div>";
                }
            }
        ]
    });
}

function getHistoryListCreated() {
    $("#cmdListCreatedHistory").DataTable({
        ajax: {
            url: $("#getAllCmdCreatedHistoryUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "ChangeType",
                render: function (data) {
                    return data === 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data === 1 ? "High" : (data === 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy hh:MM tt");
                }
            },
            {
                data: "IsApproved",
                render: function (data, type, full) {
                    return full.IsApproved === true && full.IsImplemented === false ? "<span class='label label-success'>Ready for Implementation</span>" : (full.IsApproved === false && full.IsImplemented === false ? "<span class='label label-danger'>Pending for Approval by Other Signee/s</span>" : "<span class='label label-primary'>Implemented</span>");
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-table btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "</div>";
                }
            }
        ]
    });
}

function getHistoryListApproval() {
    $("#cmdListApprovalHistory").DataTable({
        ajax: {
            url: $("#getAllCmdApprovalHistoryUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data === 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data === 1 ? "High" : (data === 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy hh:MM tt");
                }
            },
            {
                data: "IsApproved",
                render: function (data, type, full) {
                    return full.IsApproved === true && full.IsImplemented === false ? "<span class='label label-success'>Ready for Implementation</span>" : (full.IsApproved === false && full.IsImplemented === false ? "<span class='label label-danger'>Pending for Approval by Other Signee/s</span>" : "<span class='label label-primary'>Implemented</span>");
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-table btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "</div>";
                }
            }
        ]
    });
}

function getLatestCmdList() {
    $("#latestCmdTable").DataTable({
        "paging": false,
        "ordering": false,
        "info": false,

        ajax: {
            url: $("#incomingCmdImplementationUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "ApplicationUser.Lastname",
                render: function (data, type, full) {
                    return full.ApplicationUser.Firstname + " " + full.ApplicationUser.Lastname;
                }
            },
            {
                data: "ChangeType",
                render: function (data) {
                    return data === 1 ? "Corrective Patch" : "New Function";
                }
            },
            {
                data: "ChangeEvaluation",
                render: function (data) {
                    return data === 1 ? "High" : (data === 2 ? "Medium" : "Low");
                }
            },
            {
                data: "TargetImplementation",
                render: function (data) {
                    return new Date(parseInt(data.substr(6))).format("ddd mmm dd, yyyy hh:MM tt");
                }
            },
            {
                data: "Id",
                render: function (data) {
                    return "<div class='btn-group'>" +
                        "<span data-placement='top' data-toggle='tooltip' title='View Change Document Info'>" +
                        "<button type='button' class='btn btn-fill btn-table btn-primary viewButton' data-id=" + data + " data-toggle='modal' data-target='#viewCmdInfoModal' name='viewButton' id='btnView'><i class='pe-7s-search'></i></button>" +
                        "</span>" +
                        "</div>";
                }
            }
        ]
    });
}

function clearInputsNewCmd() {
    var t = $("#affectedAreasTable").DataTable();
    var t1 = $("#signOffTable").DataTable();

    $("#changeObjective").val("");
    $("#changeType").val(1);
    $("#changeRequirements").val("");
    $("#affectedAreasApp").val("");
    $("#affectedAreasDb").val("");
    $("#affectedAreasServer").val("");
    t.clear().draw();
    $("#highRadio").prop("checked", false);
    $("#mediumRadio").prop("checked", false);
    $("#lowRadio").prop("checked", false);
    $("#targetImplementation").val("");
    $("#signOffName").val("");
    $("#signOffRole").val("");
    t1.clear().draw();
}

function redrawDt() {
    var table = $("#cmdList").DataTable();

    table.row($("#btnDelete").parents("tr")).remove().draw();
}