$(document).ready(function () {
    $(document).on("click", "#btnInsertRole", function () {
        var canImplement = true;

        $("input[id=allowRadio]:checked").val() === "on" ? canImplement = true : canImplement = false;

        if ($("#newJobRoleForm").valid()) {
            $.ajax({
                method: "POST", //HTTP POST Method
                url: $("#insertJobRoleUrl").data("request-url"),
                data: {
                    JobRoleName: $("#JobRoleName").val(),
                    CanImplement: canImplement
                },
                success: function (da) {
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