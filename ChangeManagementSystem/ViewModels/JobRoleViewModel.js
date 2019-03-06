$(document).ready(function () {
    getJobRoleList();

    $(document).on("click", "#btnInsertRole", function () {
        var canImplement = true;

        $("input[id=allowRadio]:checked").val() === "on" ? canImplement = true : canImplement = false;

        if ($("#newJobRoleForm").valid()) {
            $.ajax({
                method: "POST", //HTTP POST Method
                url: $("#insertJobRoleUrl").data("request-url"),
                data: {
                    JobRoleName: $("#JobRoleName").val().trim(),
                    CanImplement: canImplement
                },
                success: function (da) {
                    var table = $("#rolesList").DataTable();

                    $.notify({
                        icon: "pe-7s-check",
                        message: "Job Role successfully added!"
                    }, {
                        type: "success",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });

                    $("#insertJobRoleModal .close").click();
                    table.destroy();
                    getJobRoleList();
                },
                error: function (da) {
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

        return false;
    });

    $(document).on("click", "#btnViewPrivilege", function () {
        $("#viewPrivilegeModal").focus();

        var id = $(this).attr("data-id");

        $.ajax({
            type: "GET",
            url: $("#findRoleUrl").data("request-url") + "?id=" + id,
            success: function (data) {
                var jsonStringified = JSON.stringify(data);
                var jobRoleDetails = JSON.parse(jsonStringified);

                $("#viewPrivilegesModalTitle").text(jobRoleDetails.JobRoleName + " Privileges");

                $("#actionRadioView").val(jobRoleDetails.CanImplement === true ? $("#allowRadioView").prop("checked", true) : $("#denyRadioView").prop("checked", true));
            },
            error: function (data) {
            }
        });
    });

    $(document).on("click", "#btnEditPrivilege", function () {
        $("#editPrivilegeModal").focus();

        var id = $(this).attr("data-id");

        $("#btnUpdatePrivilege").attr("data-edit-id", id);

        $.ajax({
            type: "GET",
            url: $("#findRoleUrl").data("request-url") + "?id=" + id,
            success: function (data) {
                var jsonStringified = JSON.stringify(data);
                var jobRoleDetails = JSON.parse(jsonStringified);

                $("#editPrivilegesModalTitle").text("Edit Privileges");

                $("#JobRoleNameEdit").val(jobRoleDetails.JobRoleName);

                $("#actionRadioEdit").val(jobRoleDetails.CanImplement === true ? $("#allowRadioEdit").prop("checked", true) : $("#denyRadioEdit").prop("checked", true));
            },
            error: function () {
                alert("Error while retrieving data of :" + id);
            }
        });
    });

    $(document).on("click", "#btnUpdatePrivilege", function () {
        var id = $(this).attr("data-edit-id");

        var canImplement = true;

        $("input[id=allowRadioEdit]:checked").val() === "on" ? canImplement = true : canImplement = false;

        if ($("#editJobRoleForm").valid()) {
            $.ajax({
                method: "POST", //HTTP POST Method
                url: $("#updateJobRoleUrl").data("request-url") + "?id=" + id,
                data: {
                    JobRoleName: $("#JobRoleNameEdit").val().trim(),
                    CanImplement: canImplement
                },
                success: function (da) {
                    var table = $("#rolesList").DataTable();

                    $.notify({
                        icon: "pe-7s-check",
                        message: "Job Role successfully updated!"
                    }, {
                        type: "success",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });

                    $("#editPrivilegeModal .close").click();
                    table.destroy();
                    getJobRoleList();
                },
                error: function (da) {
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

        return false;
    });
});

function getJobRoleList() {
    var table = $("#rolesList").DataTable({
        ajax: {
            url: $("#getAllRoleUrl").data("request-url"),
            dataSrc: ""
        },
        columns: [
            {
                data: "JobRoleName"
            },
            {
                data: "Id",
                render: function (data) {
                    return "<div class='btn-group'>" +
                                "<span data-placement='top' data-toggle='tooltip' title='View Privileges'>" +
                                    "<button type='button' class='btn btn-fill btn-primary btn-table viewPrivilegeButton' data-id=" + data + " data-toggle='modal' data-target='#viewPrivilegeModal' name='viewPrivilegeButton' id='btnViewPrivilege'><i class='pe-7s-search'></i></button>" +
                                "</span>" +
                                "<span data-placement='top' data-toggle='tooltip' title='Edit Privileges'>" +
                                    "<button type='button' class='btn btn-fill btn-warning btn-table editPrivilegeButton' data-id=" + data + " data-toggle='modal' data-target='#editPrivilegeModal' name='editPrivilegeButton' id='btnEditPrivilege'><i class='pe-7s-note'></i></button>" +
                                "</span>" +
                           "</div>";
                }
            }
        ]
    });
}