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

    $.validator.addMethod("pwcheck", function (value) {
        return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value); // has a digit
    });

    $.validator.addMethod("emptyTable", function (value) {
        if ($("#affectedAreasTable").DataTable().rows().count() === 0)
            return true;
        return false;
    }, "Empty Table!");

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
            },
            affectedAreasTable: {
                emptyTable: true
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
            },
            affectedAreasTable: {
                emptyTable: "Empty Table!"
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

    $("#newJobRoleForm").validate({
        onkeyup: false,
        onsubmit: false,
        rules: {
            JobRoleName: {
                required: true
            },

            actionRadio: {
                required: true
            }
        },

        messages: {
            JobRoleName: {
                required: "Job role name is required"
            },

            actionRadio: {
                required: "Privilege action is required"
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

    $("#editJobRoleForm").validate({
        onkeyup: false,
        onsubmit: false,
        rules: {
            JobRoleNameEdit: {
                required: true
            },

            actionRadioEdit: {
                required: true
            }
        },

        messages: {
            JobRoleNameEdit: {
                required: "Job role name is required"
            },

            actionRadioEdit: {
                required: "Privilege action is required"
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
        wrapper: "div",
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
                required: true,
                pwcheck: true,
                minlength: 6
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
                required: "Password is required",
                pwcheck: "Password must contain the following:</br><span class='passwordOne'>-lowercase letter</span></br><span class='passwordOne'>-uppercase letter</span></br><span class='passwordOne'>-special character (@ | . | _ | *)</span></br><span class='passwordOne'>-number</span>",
                minlength: "Minimum length is six (6) characters"
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