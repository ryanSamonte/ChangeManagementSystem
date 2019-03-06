$(document).ready(function () {
    getAccountList();

    $(document).on("click", "#btnInsertAccount", function () {
        if ($("#newUserAccountForm").valid()) {
            $.ajax({
                method: "POST",
                url: $("#insertAccountUrl").data("request-url"),
                data: {
                    Lastname: $("#Lastname").val(),
                    Firstname: $("#Firstname").val(),
                    Email: $("#UserName").val() + "@email.com",
                    UserName: $("#UserName").val(),
                    Password: $("#Password").val(),
                    ConfirmPassword: $("#ConfirmPassword").val(),
                    JobRoleId: $("#JobRole").val(),
                    AccountRole: "User",
                    __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newUserAccountForm").val(),
                },
                success: function (da) {
                    var table = $("#accountList").DataTable();

                    $.notify({
                        icon: "pe-7s-check",
                        message: "User account successfully added!"
                    }, {
                        type: "success",
                        timer: 4000,
                        placement: {
                            from: "bottom",
                            align: "right"
                        }
                    });
                    $("#insertUserAccountModal .close").click();
                    table.destroy();
                    getAccountList();
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

    function getAccountList() {
        var table = $("#accountList").DataTable({
            ajax: {
                url: $("#allAccountUrl").data("request-url"),
                dataSrc: ""
            },
            columns: [
                {
                    data: "Lastname",
                    render: function (data, type, full, meta) {
                        return full.Firstname + " " + full.Lastname;
                    }
                },
                {
                    data: "UserName"
                },
                {
                    data: "JobRoles.JobRoleName"
                }
            ]
        });
    }
});