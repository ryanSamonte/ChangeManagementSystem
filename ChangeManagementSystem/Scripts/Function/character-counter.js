$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    //textarea characted counter
    $(function () {
        var nMaxLength = 2000;
        $(".remainingObjective").text(nMaxLength);

        $("#changeObjective").keydown(function () {
            LimitCharacters($(this));
        });

        $("#changeObjective").keyup(function () {
            LimitCharacters($(this));
        });

        function LimitCharacters(remarks) {
            if (remarks.val().length > nMaxLength) {
                remarks.val(remarks.val().substring(0, nMaxLength));
            } else {
                var nRemaining = nMaxLength - remarks.val().length;
                $(".remainingObjective").text(nRemaining);
            }
        }
    });

    $(function () {
        var nMaxLength = 2000;
        $(".remainingObjectiveEdit").text(nMaxLength);

        $("#changeObjectiveEdit").keydown(function (event) {
            LimitCharacters($(this));
        });

        $("#changeObjectiveEdit").keyup(function (event) {
            LimitCharacters($(this));
        });

        function LimitCharacters(remarks) {
            if (remarks.val().length > nMaxLength) {
                remarks.val(remarks.val().substring(0, nMaxLength));
            } else {
                var nRemaining = nMaxLength - remarks.val().length;
                $(".remainingObjectiveEdit").text(nRemaining);
            }
        }
    });

    $(function () {
        var nMaxLength = 2000;
        $(".remainingRequirements").text(nMaxLength);

        $("#changeRequirements").keydown(function (event) {
            LimitCharacters($(this));
        });

        $("#changeRequirements").keyup(function (event) {
            LimitCharacters($(this));
        });

        function LimitCharacters(remarks) {
            if (remarks.val().length > nMaxLength) {
                remarks.val(remarks.val().substring(0, nMaxLength));
            } else {
                var nRemaining = nMaxLength - remarks.val().length;
                $(".remainingRequirements").text(nRemaining);
            }
        }
    });

    $(function () {
        var nMaxLength = 2000;
        $(".remainingRequirementsEdit").text(nMaxLength);

        $("#changeRequirementEdit").keydown(function (event) {
            LimitCharacters($(this));
        });

        $("#changeRequirementEdit").keyup(function (event) {
            LimitCharacters($(this));
        });

        function LimitCharacters(remarks) {
            if (remarks.val().length > nMaxLength) {
                remarks.val(remarks.val().substring(0, nMaxLength));
            } else {
                var nRemaining = nMaxLength - remarks.val().length;
                $(".remainingRequirementsEdit").text(nRemaining);
            }
        }
    });
});