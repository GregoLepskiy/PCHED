let main = function () {
    "use strict"

    function auth_help (callback) {
        $.getJSON("clients.json", function (clients) {
            callback(clients);
        });
    }

    $(document).ready(function () {
        $("#administrator").on("click", function () {
            if ($("#identifier").val() === "Nutella"
                && $("#password").val() === "pure") {
                $.cookie("email", "Nutella");
                window.location.replace("admin.html");
            }
        });

        $("#common_user").on("click", function () {
            auth_help(function (clients) {
                let login = $("#identifier").val(),
                    check = false;
                clients.forEach(function (client) {
                    if (login === client.email) {
                        $.cookie("email", login);
                        check = true;
                        console.log(check);
                        window.location.replace("index.html");
                    }
                });
                if (!check) alert("ERROR");
            });
        });
    });
};

$("document").ready(main);