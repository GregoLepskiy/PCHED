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

        function session_tab_func (sessions, callback) {
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
                $sessionTime.on("click", function () {
                    let hall;
                    $.getJSON("halls.json", function (halls) {
                        halls.forEach(function (haller) {
                            if (haller._id === session.hallID) hall = haller;
                        });
                        let $table = $("<table>").addClass("show_hall");
                        $.getJSON("" + hall._id + "/rows.json", function (rows) {
                            for (let i = 1; i <= hall.rowCount; i++) {
                                rows.forEach(function (row) {
                                    if (row.number === i) {
                                        let $row = $("<tr>").addClass("row_hall");
                                        $.getJSON("places/" + row._id + "/places.json", function (places) {
                                            console.log(places);
                                            for (let j = 1; j <= row.placeCount; j++) {
                                                places.forEach(function (place) {
                                                    if (place.number === j) {
                                                        console.log(place.price);
                                                        let $td = $("<td>").addClass("place_show"),
                                                            session_num, res;
                                                        for (let ses = 0; ses < place.reservation.length; ses++)
                                                            if (place.reservation[ses].session === session._id) {
                                                                session_num = ses;
                                                                res = place.reservation[ses].res;
                                                            }
                                                        if (res) {
                                                            $td.text(place.price);
                                                            $td.toggleClass('td_booked');
                                                        } else {
                                                            let $place_but = $("<button>").addClass("place_but").text(place.price)
                                                                .toggleClass('td_free').data("place_id", place._id);
                                                            $td.append($place_but).toggleClass('td_free');
                                                            $place_but.on("click", function () {
                                                                $.ajax({
                                                                    url : "/place/" + place._id + "/" + session._id,
                                                                    type : "PUT",
                                                                    data : {
                                                                        "res" : true
                                                                    }
                                                                }).done(function (response) {
                                                                    console.log(response);
                                                                }).fail(function (err) {
                                                                    console.log(err);
                                                                });
                                                                $(this).removeClass('td_free').toggleClass('td_booked');
                                                                $td.removeClass('td_free').toggleClass('td_booked');
                                                            });
                                                        }
                                                        $row.append($td);
                                                    }
                                                });
                                            }
                                        });
                                        $table.append($row);
                                    }
                                });
                            }
                        });
                        $(".show_hall_div").html("").append($table);
                    });
                });
            });
            callback(null, $content);
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
                    session_tab_func(sessions, callback);
                }
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
                        day = date.getDate() + 1;

                    result = day + '.' + month();
                    return result;
                },
                "content" : function (callback) {
                    session_tab_func(sessions, callback);
                }
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
                        day = date.getDate() + 2;

                    result = day + '.' + month();
                    return result;
                },
                "content" : function (callback) {
                    session_tab_func(sessions, callback);
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
            $(".tabs_sessions a:first-child").trigger("click");
        });
    });
};

$("document").ready(function () {
    console.log($.cookie("email"));
    if ($.cookie("email") !== undefined)
        $("#regisHref").attr("href", "#").text("Выход").click(function () {
            $.removeCookie("email");
            window.location.reload();
        });
    else
        $("#regisHref").attr("href", "/auth.html").text("Регистрация|Вход");
    main();
});