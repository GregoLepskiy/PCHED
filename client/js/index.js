let main = function () {
    $("document").ready(function () {
        let $content = $("<div>").addClass("films");
        $.getJSON("films.json", function (films) {
            films.forEach(function (film) {
                let $film = $("<div>").addClass("film_main"),
                    $img = $("<img>").addClass("film_img")
                        .attr("src", film.poster)
                        .attr("alt", film.name)
                        .attr("href", "/film.html?filmID=" + film._id),
                    $img_div = $("<div>").addClass("film_img_div")
                        .append($img),
                    $film_name = $("<a>").addClass("film_name")
                        .text(film.name)
                        .attr("href", "/film.html?filmID=" + film._id),
                    $film_rating = $("<a>").addClass("film_rating")
                        .text(film.rating),
                    $desc = $("<div>").addClass("description")
                        .append($film_name)
                        .append($film_rating);
                $film.append($img_div)
                    .append($desc);
                $content.append($film);
            });
            $(".content").append($content);
        });
    });
};

$("document").ready(main);