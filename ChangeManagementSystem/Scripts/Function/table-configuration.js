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
        var t2 = $("#signOffTableEdit").DataTable();

        $("#insertSignOffEdit").on("click", function () {
            var isApproved = false;

            if ($("#SignOff").val() === "") {
                console.log("");
            } else {
                var selectedItemText = document.getElementById('SignOff').selectedOptions[0].text;

                t2.row.add([
                    "<td><span class='tableContent'>" + selectedItemText.substring(0, selectedItemText.indexOf("~")) + "</span></td>",
                    "<td><span class='tableContent'>" + selectedItemText.substring(selectedItemText.indexOf("~") + 1, selectedItemText.length) + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + document.getElementById('SignOff').selectedOptions[0].value + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + false + "</span></td>",
                    "<div class='btn-group'>" +
                    "<span data-placement='top' data-toggle='tooltip' title='Remove Row'>" +
                    "<button type='button' id='removeBtnSignOffEdit' class='btn btn-danger btn-table btn-fill btn-sm' data-toggle='' data-target='' style='width:100%;'><i class='pe-7s-close' style='font-size:20px;'></i></button>" +
                    "</span>" +
                    "</div>"
                ]).draw(false);
            }
        });

        $("#insertSignOff").on("click", function () {
            var isApproved = false;

            if ($("#SignOff").val() === "") {
                console.log("");
            } else {
                var selectedItemText = document.getElementById('SignOff').selectedOptions[0].text;

                t1.row.add([
                    "<td><span class='tableContent'>" + selectedItemText.substring(0, selectedItemText.indexOf("~")) + "</span></td>",
                    "<td><span class='tableContent'>" + selectedItemText.substring(selectedItemText.indexOf("~") + 1, selectedItemText.length) + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + document.getElementById('SignOff').selectedOptions[0].value + "</span></td>",
                    "<td><span class='tableContent td-id-cont'>" + false + "</span></td>",
                    "<div class='btn-group'>" +
                    "<span data-placement='top' data-toggle='tooltip' title='Remove Row'>" +
                    "<button type='button' id='removeBtnSignOff' class='btn btn-danger btn-table btn-fill btn-sm' data-toggle='' data-target='' style='width:100%;'><i class='pe-7s-close' style='font-size:20px;'></i></button>" +
                    "</span>" +
                    "</div>"
                ]).draw(false);
            }
        });

        $('#affectedAreasTable').on('draw.dt', function () {
            if ($("#affectedAreasTable").DataTable().rows().count() > 0) {
                $("#affectedAreaErrorNew").hide();
            }
        });

        $('#signOffTable').on('draw.dt', function () {
            if ($("#signOffTable").DataTable().rows().count() > 0) {
                $("#signOffErrorNew").hide();
            }
        });

        $('#affectedAreasTableEdit').on('draw.dt', function () {
            if ($("#affectedAreasTableEdit").DataTable().rows().count() > 0) {
                $("#affectedAreaErrorEdit").hide();
            }
        });

        $('#signOffTableEdit').on('draw.dt', function () {
            if ($("#signOffTableEdit").DataTable().rows().count() > 0) {
                $("#signOffErrorEdit").hide();
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

        $('#signOffTableEdit tbody').on('click', '#removeBtnSignOffEdit', function () {
            t2
                .row($(this).parents("tr"))
                .remove()
                .draw();
        });
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
});