$(document).ready(function () {
    $.validator.addMethod("futureDate", function (value, element) {
        var curDate = new Date();
        var inputDate = new Date(value);
        if (inputDate > curDate)
            return true;
        return false;
    }, "Invalid Date!");

    $.validator.addMethod("futureDateAndSameValue", function (value, element) {
        var curDate = new Date();
        var inputDate = new Date(value);
        var currentDateValue = new Date($("#targetImplementationTemp").val());

        if (inputDate > curDate || currentDateValue.toString() === inputDate.toString())
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
                futureDate: "Invalid date or time input"
            }
        },

        highlight: function (input) {
            $(input).addClass("error");
        },
        unhighlight: function (input) {
            $(input).removeClass("error");
        },
        errorPlacement: function (error, element) {
            $(element).parents(".form-group").append(error);
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

            TargetImplementation: {
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

            TargetImplementation: {
                required: "Implementation date is required",
                futureDateAndSameValue: "Invalid date or time input"
            }
        },

        highlight: function (input) {
            $(input).addClass("error");
        },
        unhighlight: function (input) {
            $(input).removeClass("error");
        },
        errorPlacement: function (error, element) {
            $(element).parents(".form-group").append(error);
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

            UserName: {
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

            UserName: {
                required: "Username is required"
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
            $(input).addClass("error");
        },
        unhighlight: function (input) {
            $(input).removeClass("error");
        },
        errorPlacement: function (error, element) {
            $(element).parents(".form-group").append(error);
        }
    });
});