let main = function () {

    let help_val = function (word) {
        return (word !== "" && word.trim() !== "");
    };

    $(".accept").on("click", function () {
        let name = $("#name_regis").val(),
            surname = $("#surname_regis").val(),
            telephone = $("#phone_regis").val(),
            email = $("#email_regis").val(),
            birthDate = $("#birth_regis").val(),
            regisDate = new Date(),
            newCreation;
        if (help_val(name) &&
        help_val(surname) &&
        help_val(telephone) &&
        help_val(email) &&
        help_val(birthDate)
        )
        newCreation = ({
            "name" : name,
            "surname" : surname,
            "telephone" : telephone,
            "email" : email,
            "regisDate" : regisDate,
            "birthDate" : birthDate
        });
        $.post("clients", newCreation, function (result) {
            $.cookie("email", email);
            console.log($.cookie("email"));
            window.location.replace("index.html");
        });
    });

    $(document).ready(function () {
        $.removeCookie("email");
    });
};

$(document).ready(main);