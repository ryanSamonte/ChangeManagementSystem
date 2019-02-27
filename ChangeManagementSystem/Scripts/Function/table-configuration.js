$(document).ready(function () {
    $("#affectedAreasTable").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#affectedAreasTableView").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#affectedAreasTableViewCalendar").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#affectedAreasTableEdit").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#signOffTable").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#signOffTableView").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#signOffTableViewCalendar").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $("#signOffTableEdit").DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    $(document).ready(function () {
        var t = $("#affectedAreasTable").DataTable();

        $("#insertAffectedArea").on("click", function () {
            if ($("#affectedAreasApp").val() === "" && $("#affectedAreasDb").val() === "" && $("#affectedAreasServer").val() === "") {
                console.log("");
            } else {
                t.row.add([
                    "<td><span class='tableContent'>" + $("#affectedAreasApp").val() + "</span></td>",
                    "<td><span class='tableContent'>" + $("#affectedAreasDb").val() + "</span></td>",
                    "<td><span class='tableContent'>" + $("#affectedAreasServer").val() + "</span></td>",
                    "<div class='btn-group'>" +
                    "<span data-placement='top' data-toggle='tooltip' title='Remove Row'>" +
                    "<button type='button' id='removeBtn' class='btn btn-danger btn-table btn-fill btn-sm' data-toggle='' data-target='' style='width:100%;'><i class='pe-7s-close' style='font-size:20px;'></i></button>" +
                    "</span>" +
                    "</div>"
                ]).draw(false);
            }
        });

        var t1 = $("#signOffTable").DataTable();

        $("#insertSignOff").on("click", function () {
            if ($("#SignOff").val() === "") {
                console.log("");
            } else {
                var selectedItemText = document.getElementById('SignOff').selectedOptions[0].text;

                t1.row.add([
                    "<td><span class='tableContent'>" + selectedItemText.substring(0, selectedItemText.indexOf("~")) + "</span></td>",
                    "<td><span class='tableContent'>" + selectedItemText.substring(selectedItemText.indexOf("~") + 1, selectedItemText.length) + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + document.getElementById('SignOff').selectedOptions[0].value + "</span></td>",
                    "<div class='btn-group'>" +
                    "<span data-placement='top' data-toggle='tooltip' title='Remove Row'>" +
                    "<button type='button' id='removeBtnSignOff' class='btn btn-danger btn-table btn-fill btn-sm' data-toggle='' data-target='' style='width:100%;'><i class='pe-7s-close' style='font-size:20px;'></i></button>" +
                    "</span>" +
                    "</div>"
                ]).draw(false);
            }
        });

        $('#affectedAreasTable tbody').on('click', '#removeBtn', function () {
            t
                .row($(this).parents("tr"))
                .remove()
                .draw();
        });

        $('#signOffTable tbody').on('click', '#removeBtnSignOff', function () {
            t1
                .row($(this).parents("tr"))
                .remove()
                .draw();
        });
    });

    $(document).on("click", "#undoAffectedArea", function () {
        var table = $("#affectedAreasTable").DataTable();

        table.row((table.data().count() / 3) - 1).remove().draw();
    });

    $(document).on("click", "#undoSignOff", function () {
        var table = $("#signOffTable").DataTable();

        table.row((table.data().count() / 2) - 1).remove().draw();
    });

    $(document).on("hide.bs.modal", "#viewCmdInfoModal", function () {
        var t = $("#affectedAreasTableView").DataTable();

        t.clear().draw();

        var t1 = $("#signOffTableView").DataTable();

        t1.clear().draw();
    });

    $(document).on("hide.bs.modal", "#viewCmdInfoModalCalendar", function () {
        var t = $("#affectedAreasTableViewCalendar").DataTable();

        t.clear().draw();

        var t1 = $("#signOffTableViewCalendar").DataTable();

        t1.clear().draw();
    });

    $(document).on("hide.bs.modal", "#editCmdInfoModal", function () {
        var t = $("#affectedAreasTableEdit").DataTable();

        t.clear().draw();

        var t1 = $("#signOffTableEdit").DataTable();

        t1.clear().draw();
    });

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