let main = function () {
    "use strict"

    let mainTabs = [],
        dateStr = function (dater) {
            let result,
                dateS = new Date(dater),
                month = function () {
                    let result = String(dateS.getMonth() + 1);
                    if (result.length === 1)
                        result = '0' + result;
                    return result;
                },
                year = dateS.getFullYear(),
                date = dateS.getDate();
            result = date + '.' + month() + '.' + year;
            return result;
        },
        tabFunc = function (tab, callback) {
            let $aElement = $("<a>").attr("href", "").text(tab.name);
            $(".tabs").append($aElement);
            $aElement.on("click", function () {
                $(".content").html("");
                $(".tabs a").removeClass("active");
                $aElement.addClass("active");
                tab.content(function (err, $content) {
                    if (err !== null) {
                        alert("ERROR");
                    } else {
                        callback(null, $content);
                    }
                });
                return false;
            });
        },
        help_val = function (word) {
            return (word !== "" && word.trim() !== "");
        };

    mainTabs.push({
       "name" : "Клиент",
       "func" : function(callback) {
            let tabs = [];
            $(".tabs").html("");
            tabs.push({
               "name" : "Просмотр",
               "content" : function (callback) {
                    $.getJSON("clients.json", function (clients) {
                       let $content = $("<table>").addClass("show"),
                           $firstTR = $("<tr>"),
                           $tdName = $("<td>").text("Имя"),
                           $tdSurname = $("<td>").text("Фамилия"),
                           $tdTelephone = $("<td>").text("Телефон"),
                           $tdEmail = $("<td>").text("EMail"),
                           $tdRegisDate = $("<td>").text("Дата Рег."),
                           $tdBirthDate = $("<td>").text("Дата Рожд.");
                       $firstTR.append($tdName)
                           .append($tdSurname)
                           .append($tdTelephone)
                           .append($tdEmail)
                           .append($tdRegisDate)
                           .append($tdBirthDate);
                       $content.append($firstTR);
                       clients.forEach(function (client) {
                           let $tr = $("<tr>"),
                               $tdName = $("<td>").text(client.name),
                               $tdSurname = $("<td>").text(client.surname),
                               $tdTelephone = $("<td>").text(client.telephone),
                               $tdEmail = $("<td>").text(client.email),
                               $tdRegisDate = $("<td>").text(dateStr(client.regisDate)),
                               $tdBirthDate = $("<td>").text(dateStr(client.birthDate));
                           console.log("client._id : " + client._id);
                           console.log("surname : " + client.surname);
                           console.log(dateStr(client.regisDate));
                           $tr.append($tdName)
                               .append($tdSurname)
                               .append($tdTelephone)
                               .append($tdEmail)
                               .append($tdRegisDate)
                               .append($tdBirthDate);
                           $content.append($tr);
                       });
                       callback(null, $content);
                    });
                }
            });
            tabs.push({
               "name" : "Добавление",
               "content" : function (callback) {
                   let $addition = $("<div>").addClass("addition"),
                       $name_w = $("<a>").addClass("name_w").text("Имя"),
                       $name_i = $("<input>").addClass("name_i"),
                       $surname_w = $("<a>").addClass("surname_w").text("Фамилия"),
                       $surname_i = $("<input>").addClass("surname_i"),
                       $phone_w = $("<a>").addClass("phone_w").text("Телефон"),
                       $phone_i = $("<input>").addClass("phone_i"),
                       $email_w = $("<a>").addClass("email_w").text("EMail"),
                       $email_i = $("<input>").addClass("email_i"),
                       $birthDate_w = $("<a>").addClass("birthDate_w").text("Дата рождения"),
                       $birthDate_i = $("<input>").attr("type", "date").addClass("birthDate_i"),
                       $accept = $("<button>").addClass("accept_but").text("Принять"),
                       $names = $("<div>").addClass("names"),
                       $fields = $("<div>").addClass("fields"),
                       $but_div = $("<div>").addClass("but_div"),
                       $desc = $("<div>").addClass("description");
                   $accept.click(function() {
                       let name = $(".name_i").val(),
                           surname = $(".surname_i").val(),
                           phone = $(".phone_i").val(),
                           email = $(".email_i").val(),
                           birthDate = $(".birthDate_i").val(),
                           regisDate = new Date(),
                           newCreation;
                       if (help_val(name) && help_val(surname) && help_val(phone) && help_val(email)
                       && help_val(birthDate)){
                           newCreation = ({
                               "name": name,
                               "surname": surname,
                               "telephone": phone,
                               "email": email,
                               "regisDate": regisDate,
                               "birthDate": birthDate
                           });
                           $.post("clients", newCreation, function (result) {
                               console.log(result);
                               $(".name_i").val("");
                               $(".surname_i").val("");
                               $(".phone_i").val("");
                               $(".email_i").val("");
                               $(".birthDate_i").val("");
                           });
                       }
                   });
                   $names.append($name_w).append($surname_w).append($phone_w).append($email_w).append($birthDate_w);
                   $fields.append($name_i).append($surname_i).append($phone_i).append($email_i).append($birthDate_i);
                   $but_div.append($accept);
                   $desc.append($names).append($fields);
                   $addition.append($desc).append($but_div);
                   callback(null, $addition);
               }
            });
            tabs.push({
                "name" : "Удаление",
                "content" : function (callback) {
                    let $clients = $("<select>").addClass("client_select"),
                        $fields = $("<div>").addClass("fields").append($clients),
                        $accept = $("<button>").addClass("accept").text("Удалить"),
                        $but_div = $("<div>").addClass("but_div").append($accept),
                        $delete = $("<div>").addClass("delete").append($fields).append($but_div);
                    $accept.click(function () {
                        let id = $(".client_select option:selected").val();
                        $.ajax({
                            "url" : "/clients/" + id,
                            "type" : "DELETE"
                        }).done(function (response) {
                            console.log(response);
                            location.reload();
                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                    $.getJSON("clients.json", function (clients) {
                        clients.forEach(function (client) {
                            $clients.append('<option value="' + client._id + '">' + client.email + '</option>');
                        });
                    });
                    callback(null, $delete);
                }
            });
            for (let tab of tabs)
                tabFunc(tab, callback);
       }
    });
    mainTabs.push({
        "name" : "Фильм",
        "func" : function(callback) {
            let tabs = [];
            $(".tabs").html("");
            tabs.push({
                "name" : "Просмотр",
                "content" : function (callback) {
                    $.getJSON("films.json", function (films) {
                        let $content = $("<table>").addClass("show"),
                            $firstTR = $("<tr>"),
                            $tdName = $("<td>").text("Название"),
                            $tdGenre = $("<td>").text("Жанр"),
                            $tdDirector = $("<td>").text("Режиссер"),
                            $tdStudio = $("<td>").text("Студия"),
                            $tdSynopsis = $("<td>").text("Синопсис"),
                            $tdPoster = $("<td>").text("Постер"),
                            $tdActors = $("<td>").text("Актеры"),
                            $tdRating = $("<td>").text("Рейтинг"),
                            $tdAge = $("<td>").text("Возр. огр.");
                        $firstTR.append($tdName)
                            .append($tdGenre)
                            .append($tdDirector)
                            .append($tdStudio)
                            .append($tdSynopsis)
                            .append($tdPoster)
                            .append($tdActors)
                            .append($tdRating)
                            .append($tdAge);
                        $content.append($firstTR);
                        films.forEach(function (film) {
                            let $tr = $("<tr>"),
                                $tdName = $("<td>").text(film.name),
                                $tdGenre = $("<td>").text(function () {
                                    let result = "";
                                    film.genre.forEach(function (genre) {
                                        result += genre + '\n';
                                    });
                                    return result.substr(0, result.length - 1);
                                }),
                                $tdDirector = $("<td>").text(film.director),
                                $tdStudio = $("<td>").text(film.studio),
                                $tdSynopsis = $("<td>").text(film.synopsis),
                                $tdPoster = $("<td>").append(($("<img>")).attr("src", film.poster).addClass("table_img").attr("alt", film.name)),
                                $tdActors = $("<td>").text(function () {
                                    let result = "";
                                    film.actors.forEach(function (actor) {
                                        result += actor + '\n';
                                    });
                                    return result.substr(0, result.length - 1);
                                }),
                                $tdRating = $("<td>").text(film.rating),
                                $tdAge = $("<td>").text(film.age + "+");
                            console.log(film.name);
                            $tr.append($tdName)
                                .append($tdGenre)
                                .append($tdDirector)
                                .append($tdStudio)
                                .append($tdSynopsis)
                                .append($tdPoster)
                                .append($tdActors)
                                .append($tdRating)
                                .append($tdAge);
                            $content.append($tr);
                        });
                        callback(null, $content);
                    });
                }
            });
            tabs.push({
                "name" : "Добавить",
                "content" : function (callback) {
                    let $addition = $("<div>").addClass("addition"),
                        $name_w = $("<a>").text("Название"),
                        $name_i = $("<input>").addClass("name_i"),
                        $genre_w = $("<a>").text("Жанр"),
                        $genre_i = $("<input>").addClass("genre_i"),
                        $director_w = $("<a>").text("Режиссер"),
                        $director_i = $("<input>").addClass("director_i"),
                        $studio_w = $("<a>").text("Студия"),
                        $studio_i = $("<input>").addClass("studio_i"),
                        $synopsis_w = $("<a>").text("Синопсис"),
                        $synopsis_i = $("<input>").addClass("synopsis_i"),
                        $poster_w = $("<a>").text("Постер"),
                        $poster_i = $("<input>").addClass("poster_i"),
                        $actors_w = $("<a>").text("Актеры"),
                        $actors_i = $("<input>").addClass("actors_i"),
                        $rating_w = $("<a>").text("Рейтинг"),
                        $rating_i = $("<input>").addClass("rating_i"),
                        $age_w = $("<a>").text("Ограничение"),
                        $age_i = $("<input>").addClass("age_i"),
                        $accept = $("<button>").addClass("accept_but").text("Принять"),
                        $names = $("<div>").addClass("names"),
                        $fields = $("<div>").addClass("fields"),
                        $but_div = $("<div>").addClass("but_div"),
                        $desc = $("<div>").addClass("description");
                    $accept.click(function() {
                        let name = $(".name_i").val(),
                            genre = $(".genre_i").val().split(','),
                            director = $(".director_i").val(),
                            studio = $(".studio_i").val(),
                            synopsis = $(".synopsis_i").val(),
                            poster = $(".poster_i").val(),
                            actors = $(".actors_i").val().split(','),
                            rating = Number($(".rating_i").val()),
                            age = Number($(".age_i").val()),
                            newCreation;
                        if (help_val(name) && help_val(director) && help_val(studio)
                        && help_val(synopsis) && help_val(poster)) {
                            newCreation = ({
                                "name": name,
                                "genre": genre,
                                "director": director,
                                "studio": studio,
                                "synopsis": synopsis,
                                "poster": poster,
                                "actors": actors,
                                "rating": rating,
                                "age": age
                            });
                            $.post("films", newCreation, function (result) {
                                console.log(result);
                                $(".name_i").val("");
                                $(".genre_i").val("");
                                $(".director_i").val("");
                                $(".studio_i").val("");
                                $(".synopsis_i").val("");
                                $(".poster_i").val("");
                                $(".actors_i").val("");
                                $(".rating_i").val("");
                                $(".age_i").val("");
                            });
                        }
                    });
                    $names.append($name_w).append($genre_w).append($director_w).append($studio_w).append($synopsis_w).append($poster_w).append($actors_w).append($rating_w).append($age_w);
                    $fields.append($name_i).append($genre_i).append($director_i).append($studio_i).append($synopsis_i).append($poster_i).append($actors_i).append($rating_i).append($age_i);
                    $but_div.append($accept);
                    $desc.append($names).append($fields);
                    $addition.append($desc).append($but_div);
                    callback(null, $addition);
                }
            });
            tabs.push({
                "name" : "Удалить",
                "content" : function (callback) {
                    let $films = $("<select>").addClass("film_select"),
                        $fields = $("<div>").addClass("fields").append($films),
                        $accept = $("<button>").addClass("accept").text("Удалить"),
                        $but_div = $("<div>").addClass("but_div").append($accept),
                        $delete = $("<div>").addClass("delete").append($fields).append($but_div);
                    $accept.click(function () {
                        let id = $(".film_select option:selected").val();
                        $.ajax({
                            "url" : "/films/" + id,
                            "type" : "DELETE"
                        }).done(function (response) {
                            console.log(response);
                            location.reload();
                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                    $.getJSON("films.json", function (films) {
                        films.forEach(function (film) {
                            $films.append('<option value="' + film._id + '">' + film.name + '</option>');
                        });
                    });
                    callback(null, $delete);
                }
            });
            for (let tab of tabs)
                tabFunc(tab, callback);
        }
    });
    mainTabs.push({
        "name" : "Зал",
        "func" : function(callback) {
            let tabs = [];
            $(".tabs").html("");
            tabs.push({
                "name" : "Просмотр",
                "content" : function (callback) {
                    $.getJSON("halls.json", function (halls) {
                       let $content = $("<table>").addClass("show"),
                           $firstTR = $("<tr>"),
                           $tdNumb = $("<td>").text("Номер"),
                           $tdPlaceCount = $("<td>").text("Количество мест"),
                           $tdRowCount = $("<td>").text("Колчество рядов"),
                           $tdShow = $("<td>").text("Просмотр");
                       $firstTR.append($tdNumb)
                           .append($tdPlaceCount)
                           .append($tdRowCount)
                           .append($tdShow);
                       $content.append($firstTR);
                       halls.forEach(function (hall) {
                          let $tr = $("<tr>"),
                              $tdNumb = $("<td>").text(hall.numb),
                              $tdPlaceCount = $("<td>").text(hall.placeCount),
                              $tdRowCount = $("<td>").text(hall.rowCount),
                              $tdShow = $("<td>").attr("href", hall._id).text("Просмотр");
                          console.log("hall.numb: ", hall.numb);
                          $tdShow.on("click", function () {
                              let $table = $("<table>").addClass("show_hall");
                              $.getJSON("" + hall._id + "/rows.json", function (rows) {
                                  rows.forEach(function (row) {
                                     let $row = $("<tr>").addClass("row_hall");
                                     $.getJSON("places/" + row._id + "/places.json", function (places) {
                                        console.log(places);
                                        places.forEach(function (place) {
                                            console.log(place.price);
                                            let $td = $("<td>").addClass("place_show");
                                            $td.text(place.price);
                                            $td.toggleClass(place.reservation ? 'td_booked' : 'td_free');
                                            $row.append($td);
                                        });
                                     });
                                     $table.append($row);
                                  });
                              });
                              $(".show_hall_div").html("").append($table);
                              //TODO: function for show hall
                          });
                          $tr.append($tdNumb)
                              .append($tdPlaceCount)
                              .append($tdRowCount)
                              .append($tdShow);
                          $content.append($tr);
                       });
                       callback(null, $content);
                    });
                }
            });
            tabs.push({
                "name" : "Добавление",
                "content" : function (callback) {
                    let $addition = $("<div>").addClass("addition"),
                        $common = $("<div>").addClass("common"),
                        $table = $("<table>").addClass("table_hall"),
                        $but_div = $("<div>").addClass("but_div"),
                        first_td = function (i) {
                            let $m_price = $("<div>").addClass("m_price m" + i).data("number", i),
                                $m_price_w = $("<a>").text("Срд.цена"),
                                $m_price_i = $("<input>").addClass("m_price_i m" + i).data("number", i);
                            $m_price.append($m_price_w).append($m_price_i);
                            $m_price_i.change(function () {
                                let numb = $(this).data("number") - 1, str;
                                for (let i = 1; i <= $(".placeRowCount_i").val(); i++) {
                                    str = "#mpp" + numb + "" + i;
                                    $(str).val($(this).val()).data("price", $(this).val());
                                    console.log($(str));
                                    console.log($(str).data("price"));
                                    console.log($(str).val());
                                }
                            });
                            return $m_price;
                        },
                        place_td = function (i, j, price, type) {
                            let $m_place = $("<div>").addClass("m_place").data("number", j),
                                $m_place_price = $("<input>").addClass("m_place_price").val(price).data("price", price).attr("id", "mpp" + i + "" + j),
                                $m_place_type = $("<input>").addClass("m_place_type").val(type).data("type", type).attr("id", "mpt" + i + "" + j);
                            $m_place.append($m_place_price).append($m_place_type);
                            $m_place_price.change(function () {
                                $(this).data("price", Number($(this).val()));
                                console.log($(this).data("price"));
                            });
                            $m_place_type.change(function () {
                                $(this).data("type", $(this).val());
                                console.log($(this).data("type"));
                            });
                            return $m_place;
                        },
                        $hallNumb_w = $("<a>").text("Ном.зала"),
                        $rowCount_w = $("<a>").text("Кол-во рядов"),
                        $placeRowCount_w = $("<a>").text("Кол-во мест в ряду"),
                        $priceM_w = $("<a>").text("Срд.цена"),
                        $hallNumb_i = $("<input>").addClass("hallNumb_i"),
                        $rowCount_i = $("<input>").addClass("rowCount_i"),
                        $placeRowCount_i = $("<input>").addClass("placeRowCount_i"),
                        $priceM_i = $("<input>").addClass("priceM_i"),
                        $accept = $("<button>").addClass("accept_but").text("Принять");
                    $(".show_hall_div").html("");
                    $rowCount_i.change(function () {
                        let rows = Number($(this).val());
                        $table.html("");
                        for (let i = 0; i < rows; i++) {
                            let $row = $("<tr>").data("number", i + 1).append(first_td(i + 1));
                            $table.append($row);
                        }
                    });
                    $placeRowCount_i.change(function () {
                        let rows = $(".table_hall tr:last").index() + 1,
                            places = $(this).val();
                        $table.html("");
                        for (let i = 0; i < rows; i++) {
                            let $row = $("<tr>").data("number", i + 1).append(first_td(i + 1));
                            for (let j = 0; j < places; j++) {
                                let $place = place_td(i, j + 1, Number($(".priceM_i").val()), "none"),
                                    $td = $("<td>").data("number", j + 1).append($place);
                                $row.append($td);
                            }
                            $table.append($row);
                        }
                    });
                    $priceM_i.change(function () {
                        let rows = $(".rowCount_i").val(),
                            price = Number($(this).val()),
                            places = $(".placeRowCount_i").val();
                        for (let i = 0; i < rows; i++)
                            for (let j = 1; j <= places; j++)
                                $("#mpp" + i + "" + j).val(price).data("price", price);
                    });
                    $accept.click(function () {
                        let hallNumb = $(".hallNumb_i").val(),
                            rowCount = Number($(".rowCount_i").val()),
                            placeRowCount = Number($(".placeRowCount_i").val()),
                            placeCount = rowCount * placeRowCount,
                            newHall = ({
                                "numb" : hallNumb,
                                "rowCount" : rowCount,
                                "placeCount" : placeCount
                            });
                        $.post("halls", newHall, function (hall) {
                            let value = 0,
                                $progress = $("<progress>").addClass("progress_hall").attr("max", placeCount).attr("value", value);
                            console.log(hall);
                            $(".but_div").append($progress);
                            for (let i = 1; i <= rowCount; i++) {
                                let rowNumb = i,
                                    hallID = hall._id,
                                    newRow = ({
                                        "placeCount" : placeRowCount,
                                        "number" : rowNumb,
                                        "hallID" : hallID
                                    });
                                $.post("rows", newRow, function (row) {
                                    console.log(row);
                                    for (let j = 1; j <= placeRowCount; j++) {
                                        let reservation = false,
                                            placeNumb = j,
                                            type = $("#mpt" + (rowNumb - 1) + "" + j).data("type"),
                                            price = $("#mpp" + (rowNumb - 1) + "" + j).data("price"),
                                            rowID = row._id,
                                            newPlace = ({
                                                "type" : type,
                                                "price" : price,
                                                "reservation" : reservation,
                                                "number" : placeNumb,
                                                "rowID" : rowID
                                            });
                                        $.post("places", newPlace, function (place) {
                                            console.log(place);
                                            $(".progress_hall").attr("value", $(".progress_hall").attr("value") + 1);
                                        });
                                    }
                                });
                            }
                            $(".tabs:first-child").trigger("click");
                        });
                    });
                    $common.append($hallNumb_w)
                        .append($hallNumb_i)
                        .append($rowCount_w)
                        .append($rowCount_i)
                        .append($placeRowCount_w)
                        .append($placeRowCount_i)
                        .append($priceM_w)
                        .append($priceM_i);
                    $but_div.append($accept);
                    $addition.append($common)
                        .append($table)
                        .append($but_div);
                    callback(null, $addition);
                }
            });
            tabs.push({
                "name" : "Удаление",
                "content" : function (callback) {
                    let $halls = $("<select>").addClass("hall_select"),
                        $accept = $("<button>").addClass("accept_but").
                            text("Удалить"),
                        $fields = $("<div>").addClass("fields")
                            .append($halls),
                        $desc = $("<div>").addClass("description")
                            .append($fields),
                        $but_div = $("<div>").addClass("but_div")
                            .append($accept),
                        $delete = $("<div>").addClass("delete")
                            .append($desc)
                            .append($but_div);
                    $accept.click(function () {
                        let hallID = $(".hall_select option:selected").val();
                        $.ajax({
                            "url" : "/halls/" + hallID,
                            "type" : "DELETE"
                        }).done(function (response) {
                            console.log(response);
                            location.reload();
                        }).fail(function (err) {
                            console.log(err);
                        });
                        return false;
                    });
                    $.getJSON("halls.json", function (halls) {
                        halls.forEach(function (hall) {
                            $halls.append(
                                '<option value="' + hall._id + '">' + hall.numb + '</option>'
                            );
                        });
                        callback(null, $delete);
                    });
                }
            });
            for (let tab of tabs)
                tabFunc(tab, callback);
        }
    });
    mainTabs.push({
        "name" : "Сеанс",
        "func" : function(callback) {
            let tabs = [];
            $(".tabs").html("");
            tabs.push({
                "name" : "Просмотр",
                "content" : function (callback) {
                    let $sesShowDiv = $("<div>").addClass("ses_show_div"),
                        $sesTabs = $("<div>").addClass("ses_tabs"),
                        $sesContent = $("<div>").addClass("ses_content"),
                        sesTabs = [],
                        tabFunc = function (tab, callback) {
                            let $aElement = $("<a>").attr("href", ""),
                                $spanElement = $("<span>").text(tab.name);
                            $aElement.append($spanElement);
                            $(".ses_tabs").append($aElement);
                            $spanElement.on("click", function () {
                                $(".ses_content").html("");
                                $(".ses_tabs a span").removeClass("active");
                                $spanElement.addClass("active");
                                tab.content(function (err, $content) {
                                    if (err !== null) {
                                        alert("ERROR");
                                    } else {
                                        callback(null, $content);
                                    }
                                });
                                return false;
                            });
                        };
                    $sesShowDiv.append($sesTabs).append($sesContent);
                    $(".content").append($sesShowDiv);
                    sesTabs.push({
                       "name" : "Все",
                       "content" : function (callback) {
                           $(".ses_content").html("");
                           $(".show").remove();
                           $.getJSON("sessions.json", function (sessions) {
                               let $table = $("<table>").addClass("show"),
                                   $firstTR = $("<tr>"),
                                   $tdHall = $("<th>").text("Зал"),
                                   $tdFilm = $("<th>").text("Фильм"),
                                   $tdTime = $("<th>").text("Время"),
                                   filmName = function (films, session) {
                                       let result = "-1";
                                       films.forEach(function (film) {
                                           if (film._id === session.filmID) result = film.name;
                                       });
                                       return result;
                                   },
                                   hallNumb = function (halls, session) {
                                       let result = -2;
                                       halls.forEach(function (hall) {
                                           if (hall._id === session.hallID) result = hall.numb;
                                       });
                                       return result;
                                   };
                               $firstTR.append($tdHall)
                                   .append($tdFilm)
                                   .append($tdTime);
                               $table.append($firstTR);
                               $.getJSON("halls.json", function (halls) {
                                  $.getJSON("films.json", function (films) {
                                     sessions.forEach(function (session) {
                                         let fName = filmName(films, session),
                                             hNumb = hallNumb(halls, session),
                                             $TR = $("<tr>"),
                                             $tdHall = $("<td>").text(hNumb),
                                             $tdFilm = $("<td>").text(fName),
                                             $tdTime = $("<td>").text(session.time);
                                         $TR.append($tdHall)
                                             .append($tdFilm)
                                             .append($tdTime);
                                         $table.append($TR);
                                     });
                                  });
                               });
                               callback(null, $table);
                           });
                       }
                    });
                    for (let tab of sesTabs) tabFunc(tab, callback);
                }
            });
            tabs.push({
                "name" : "Добавление",
                "content" : function (callback) {
                    let $addition = $("<div>").addClass("addition"),
                        $hall_w = $("<a>").text("Номер зала"),
                        $hall_i = $("<select>").addClass("hall_i"),
                        $film_w = $("<a>").text("Название фильма"),
                        $film_i = $("<select>").addClass("film_i"),
                        $time_w = $("<a>").text("Время"),
                        $time_i = $("<input>").addClass("time_i"),
                        $accept = $("<button>").addClass("accept_but").text("Принять"),
                        $but_div = $("<div>").addClass("but_div"),
                        $names = $('<div>').addClass("names"),
                        $fields = $('<div>').addClass("fields"),
                        $desc = $('<div>').addClass("description");
                    $names.append($hall_w).append($film_w).append($time_w);
                    $fields.append($hall_i).append($film_i).append($time_i);
                    $but_div.append($accept);
                    $desc.append($names).append($fields);
                    $addition.append($desc).append($but_div);
                    $accept.click(function() {
                        let film = $(".film_i option:selected").val(),
                            hall = $(".hall_i option:selected").val(),
                            time = $(".time_i").val(),
                            newCreation = ({
                                "filmID" : film,
                                "hallID" : hall,
                                "time" : time
                            });
                        $.post("sessions", newCreation, function (result) {
                            console.log(result);
                        });
                    });
                    $.getJSON("films.json", function (films) {
                        $.getJSON("halls.json", function (halls){
                            films.forEach(function(film) {
                                $film_i.append('<option value="' + film._id + '">' + film.name + '</option>');
                            });
                            halls.forEach(function(hall) {
                                $hall_i.append('<option value="' + hall._id + '">' + hall.numb + '</option>')
                            });
                            callback(null, $addition);
                        });
                    });
                }
            });
            tabs.push({
                "name" : "Удаление",
                "content" : function (callback) {
                    let $sessions = $("<select>").addClass("session_select"),
                        $accept = $("<button>").addClass("accept_but").text("Удалить"),
                        $fields = $("<div>").addClass("fields").append($sessions),
                        $desc = $("<div>").addClass("description")
                            .append($fields),
                        $but_div = $("<div>").addClass("but_div")
                            .append($accept),
                        $delete = $("<div>").addClass("delete")
                            .append($desc)
                            .append($but_div);
                    $accept.click(function () {
                        let id = $(".session_select option:selected").val();
                        $.ajax({
                            "url" : "/sessions/" + id,
                            "type" : "DELETE"
                        }).done(function (response) {
                            console.log(response);
                            location.reload();
                        }).fail(function (err) {
                            console.log(err);
                        });
                        return false;
                    });
                    $.getJSON("films.json", function (films) {
                        $.getJSON("halls.json", function (halls){
                            $.getJSON("sessions.json", function (sessions) {
                                let getFilm = function (filmID) {
                                    let res = null;
                                    films.forEach(function (film) {
                                        if (film._id === filmID) res = film.name;
                                    });
                                    return res;
                                }, getHall = function (hallID) {
                                    let res = null;
                                    halls.forEach(function (hall) {
                                        if (hall._id === hallID) res = hall.numb;
                                    });
                                    return res;
                                };
                                sessions.forEach(function (session) {
                                    $sessions.append(
                                        '<option value="' + session._id + '">' + getHall(session.hallID) + ":: " + getFilm(session.filmID) + ":: " + session.time + '</option>'
                                    );
                                });
                            });
                        });
                        callback(null, $delete);
                    });
                }
            })
            for (let tab of tabs)
                tabFunc(tab, callback);
        }
    });
    mainTabs.push({
        "name" : "Работничек",
        "func" : function(callback) {
            let tabs = [];
            $(".tabs").html("");
            tabs.push({
                "name" : "Просмотр",
                "content" : function (callback) {
                    $.getJSON("workers.json", function (workers) {
                        let $content = $("<table>").addClass("show"),
                            $firstTR = $("<tr>"),
                            $tdSurname = $("<td>").text("Фамилия"),
                            $tdName = $("<td>").text("Имя"),
                            $tdPatronymic = $("<td>").text("Отчество"),
                            $tdPosition = $("<td>").text("Должность"),
                            $tdRole = $("<td>").text("Роль"),
                            $tdSalary = $("<td>").text("Зарплата");
                        $firstTR.append($tdSurname)
                            .append($tdName)
                            .append($tdPatronymic)
                            .append($tdPosition)
                            .append($tdRole)
                            .append($tdSalary);
                        $content.append($firstTR);
                        workers.forEach(function (worker) {
                            let $tr = $("<tr>"),
                                $tdSurname = $("<td>").text(worker.surname),
                                $tdName = $("<td>").text(worker.name),
                                $tdPatronymic = $("<td>").text(worker.patronymic),
                                $tdPosition = $("<td>").text(worker.position),
                                $tdRole = $("<td>").text(worker.role),
                                $tdSalary = $("<td>").text(worker.salary);
                            console.log("worker._id : " + worker._id);
                            console.log("surname : " + worker.surname);
                            $tr.append($tdSurname)
                                .append($tdName)
                                .append($tdPatronymic)
                                .append($tdPosition)
                                .append($tdRole)
                                .append($tdSalary);
                            $content.append($tr);
                        });
                        callback(null, $content);
                    });
                }
            });
            tabs.push({
                "name" : "Добавление",
                "content" : function (callback) {
                    let $addition = $("<div>").addClass("addition"),
                        $name_w = $("<a>").text("Имя"),
                        $name_i = $("<input>").addClass("name_i"),
                        $surname_w = $("<a>").text("Фамилия"),
                        $surname_i = $("<input>").addClass("surname_i"),
                        $patronymic_w = $("<a>").text("Отчество"),
                        $patronymic_i = $("<input>").addClass("patronymic_i"),
                        $position_w = $("<a>").text("Должность"),
                        $position_i = $("<input>").addClass("position_i"),
                        $role_w = $("<a>").text("Роль"),
                        $role_i = $("<input>").addClass("role_i"),
                        $salary_w = $("<a>").text("Зарплата"),
                        $salary_i = $("<input>").addClass("salary_i"),
                        $accept = $("<button>").addClass("accept_but").text("Принять"),
                        $but_div = $("<div>").addClass("but_div"),
                        $names = $('<div>').addClass("names"),
                        $fields = $('<div>').addClass("fields"),
                        $desc = $('<div>').addClass("description");

                    $accept.click(function() {
                        let name = $(".name_i").val(),
                            surname = $(".surname_i").val(),
                            patronymic = $(".patronymic_i").val(),
                            position = $(".position_i").val(),
                            role = $(".role_i").val(),
                            salary = Number($(".salary_i").val()),
                            newCreation;
                        if (help_val(name) && help_val(surname) && help_val(patronymic)
                        && help_val(position) && help_val(role)) {
                            newCreation = ({
                                "name" : name,
                                "surname" : surname,
                                "patronymic" : patronymic,
                                "position" : position,
                                "role" : role,
                                "salary" : salary
                            });
                            $.post("workers", newCreation, function (result) {
                                console.log(result);
                                $(".name_i").val("");
                                $(".surname_i").val("");
                                $(".patronymic_i").val("");
                                $(".position_i").val("");
                                $(".role_i").val("");
                                $(".salary_i").val("");
                            });
                        }
                    });
                    $names.append($name_w).append($surname_w).append($patronymic_w).append($position_w).append($role_w).append($salary_w);
                    $fields.append($name_i).append($surname_i).append($patronymic_i).append($position_i).append($role_i).append($salary_i);
                    $but_div.append($accept);
                    $desc.append($names).append($fields);
                    $addition.append($desc).append($but_div);
                    callback(null, $addition);
                }
            });
            tabs.push({
                "name" : "Удаление",
                "content" : function (callback) {
                    let $workers = $("<select>").addClass("worker_select"),
                        $fields = $("<div>").addClass("fields").append($workers),
                        $accept = $("<button>").addClass("accept").text("Удалить"),
                        $but_div = $("<div>").addClass("but_div").append($accept),
                        $delete = $("<div>").addClass("delete").append($fields).append($but_div);
                    $accept.click(function () {
                        let id = $(".worker_select option:selected").val();
                        $.ajax({
                            "url" : "/workers/" + id,
                            "type" : "DELETE"
                        }).done(function (response) {
                            console.log(response);
                            location.reload();
                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                    $.getJSON("workers.json", function (workers) {
                        workers.forEach(function (worker) {
                            $workers.append('<option value="' + worker._id + '">' + worker.surname + '</option>');
                        });
                    });
                    callback(null, $delete);
                }
            })
            for (let tab of tabs)
                tabFunc(tab, callback);
        }
    });

    $(document).ready(function () {
        $("header").append($("<a>").text("PIPISKA").attr("href", "/index.html"));
        mainTabs.forEach(function (tab) {
            let $aElement = $("<a>").attr("href", "").text(tab.name);
            $(".menu").append($aElement);
            $aElement.on("click", function () {
                $(".content").html("");
                $(".show_hall_div").html("");
                $(".menu a").removeClass("active");
                $aElement.addClass("active");
                tab.func(function (err, $content) {
                    if (err !== null) {
                        alert("ERROR");
                    } else {
                        $(".content").append($content);
                    }
                });
                return false;
            });
        });
    });
};

$("document").ready(main);