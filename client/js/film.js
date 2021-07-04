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

        init(function (film, sessions) {
            let tabs = [];
            $("title").text(film.name);
            $(".film_main_name").text(film.name);
            $(".poster_img").attr("src", film.poster).attr("alt", film.name);
            $(".synopsis_p").text(film.synopsis);
            $(".director_p").text(film.director);
            $(".genre_p").text(function () {
                let result = "";
                film.genre.forEach(function (genre) {
                    result += genre + '\n';
                });
                return result.substr(0, result.length - 1);
            });
            $(".actor_p").text(function () {
                let result = "";
                film.actors.forEach(function (actor) {
                    result += actor + '\n';
                });
                return result.substr(0, result.length - 1);
            });
            tabs.push({
                "name" : function () {
                    let date = new Date(),
                        result,
                        month = function () {
                            let result = String(date.getMonth() + 1);
                            if (result.length === 1) result = '0' + result;
                            return result;
                        },
                        day = date.getDate();

                    result = day + '.' + month();
                    return result;
                },
                "content" : function (callback) {
                    let $content = $("<div>").addClass("sessions_content");
                    sessions.sort(function (a, b) {
                        if (a.time > b.time) return 1;
                        else if (b.time > a.time) return -1;
                        else return 0;
                    });
                    sessions.forEach(function (session) {
                        let $sessionTime = $("<button>").addClass("session_but");
                        $sessionTime.text(session.time);
                        $content.append($sessionTime);
                    });
                    callback(null, $content);
                }
            });
            tabs.forEach(function (tab) {
                let $aElement = $("<a>").attr("href", "")
                    .text(tab.name);
                $(".tabs_sessions").append($aElement);
                $aElement.on("click", function () {
                    $(".sessions_con_div").html("");
                    $(".menu a").removeClass("active");
                    $aElement.addClass("active");
                    tab.content(function (err, $content) {
                        if (err) alert("ERROR");
                        else $(".sessions_con_div").append($content);
                    });
                    return false;
                });
            });
        });
        $(".tabs_sessions:first-child").trigger("click");
    });
};

$("document").ready(main);