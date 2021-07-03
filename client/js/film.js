let main = function () {
    $(document).ready(function () {
        function init (callback) {
            $.getJSON("films.json", function (films) {
                let filmID = window.location.href.split('?')[1].split('=')[1];
                films.forEach(function (film) {
                    if (film._id === filmID)
                        $.getJSON("/" + filmID + "/sessions.json", function (sessions) {
                            callback(film, sessions);
                        });
                });
            });
        }

        let $film, $sessions;

        init(function (film, sessions) {
            $film = film;
            $sessions = sessions;
            $("title").text($film.name);
        });
    });
};

$("document").ready(main);