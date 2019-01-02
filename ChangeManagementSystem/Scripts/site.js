$(document).ready(function () {
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

    $('#affectedAreasTableEdit').DataTable({
        "paging": false,
        "ordering": false,
        "info": false
    });

    getList();


    //validations
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
                required: true
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
            //$(element).parents('.radio-inline').append(error);
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
            //$(element).parents('.radio-inline').append(error);
        }
    });
});

$(document).ready(function () {
    var table = $('#affectedAreasTable').DataTable();

    $('#affectedAreasTable tbody').on('click', '#removeBtn', function () {
        table
            .row($(this).parents('tr'))
            .remove()
            .draw();
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
});

$(document).on("hide.bs.modal", "#viewCmdInfoModal", function () {
    var t = $('#affectedAreasTableView').DataTable();

    t.clear().draw();
});

$(document).on("hide.bs.modal", "#editCmdInfoModal", function () {
    var t = $('#affectedAreasTableEdit').DataTable();

    t.clear().draw();
});

$(document).on("click", "#btnSave", function () {
    var changeEvaluation = 0;

    $("input[id=highRadio]:checked").val() == "on" ? changeEvaluation = 1 : ($("input[id=mediumRadio]:checked").val() == "on" ? changeEvaluation = 2 : changeEvaluation = 3);

    if ($("#newChangeDocumentForm").valid()) {
        $.ajax({
            method: "POST", //HTTP POST Method
            url: "/Cmd/Save",
            data: {
                ChangeObjective: $("#changeObjective").val(),
                ChangeType: $("#changeType").val(),
                ChangeRequirements: $("#changeRequirements").val(),
                AffectedAreas: JSON.stringify(tableToJSON($("#affectedAreasTable"))),
                ChangeEvaluation: changeEvaluation,
                TargetImplementation: $("#targetImplementation").val(),
                __RequestVerificationToken: $("input[name='__RequestVerificationToken']", "#newChangeDocumentForm").val(),
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

    var t = $('#affectedAreasTableView').DataTable();

    $.ajax({
        type: "GET",
        url: "/Cmd/Find?id=" + id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);

            var cmdDetails = JSON.parse(jsonStringified);

            var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

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
            $("#targetImplementationView").val(cmdDetails.TargetImplementation);
        },
        error: function () {
            alert("Error while retrieving data of :" + id);
        }
    });
});

$(document).on("click", "#btnEdit", function () {
    $("#editCmdInfoModal").focus();

    var id = $(this).attr("data-id");

    $("#btnUpdate").attr("data-edit-id", id);

    var t = $('#affectedAreasTableEdit').DataTable();

    $.ajax({
        type: "GET",
        url: "/Cmd/Find?id=" + id,
        success: function (data) {
            var jsonStringified = JSON.stringify(data);

            var cmdDetails = JSON.parse(jsonStringified);

            var affectedAreaDetails = JSON.parse(cmdDetails.AffectedAreas);

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
            $("#requestEvaluationEdit").val((cmdDetails.ChangeEvaluation == 1 ? "High" : (cmdDetails.ChangeEvaluation == 2 ? "Medium" : "Low")));
            $("#targetImplementationEdit").val(cmdDetails.TargetImplementation);
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
                data: "Id",
                render: function (data) {
                    return "John Doe";
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
                    return new Date(parseInt(data.substr(6)));
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
                    return "<input type='button' class='btn btn-fill btn-danger deleteButton' data-id=" + data + " name='deleteButton' id='btnDelete' value='Delete' style='width:100%;'/>";
                }
            }
        ]
    });
}

function clearInputsNewCmd() {
    var t = $('#affectedAreasTable').DataTable();

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
}

function redrawDt() {
    var table = $("#cmdList").DataTable();

    table.row($("#btnDelete").parents("tr")).remove().draw();
}