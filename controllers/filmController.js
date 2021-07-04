let Film = require("../models/film"),
    Session = require("../models/session"),
    FilmController = {};

Film.find({}, function (err, result) {
    if (err) {
        console.log("ERROR: FILM.FIND");
        console.log(err);
    } else if (result.length === 0) {
        console.log("NEW FILM CREATION");
        let exampleFilm = new Film({"name" : "Malcolm & Marie",
                                        "genre" : ["Romance", "Drama"],
                                        "director" : "S.Levinson",
                                        "studio" : "Indie",
                                        "synopsis" : "A director and his girlfriend's relationship is tested after they return home from his movie premiere and face each other's turmoil during one long night.",
                                        "poster" : "./images/malcolm&marie.jpg",
                                        "actors" : ["J.D. Washington", "Zendaya"],
                                        "rating" : 6.7,
                                        "age" : 18
            });
        exampleFilm.save(function (err) {
            if (err) console.log(err);
            else console.log("TEST FILM SAVED");
        });
    }
});

FilmController.index = function (req, res) {
    console.log(this.name);
    let _id = req.params.id || null,
        respondWithFilms = function (query) {
            Film.find(query, function (err, film) {
                if (err) res.status(500).json(err);
                else res.status(200).json(film);
            });
        };
    if (_id !== null) respondWithFilms({"_id" : _id});
    else respondWithFilms({});
};

FilmController.show = function (req, res) {
    console.log(this.name);
    Film.find({"_id" : req.params.id}, function (err, films) {
        if (err) res.status(500).json(err);
        else {
            if (films.length !== 0) res.sendfile("../client/index.html");
            else res.status(404).json("NOT FOUND");
        }
    });
};

FilmController.create = function (req, res) {
    console.log(this.name);
    let name = req.body.name,
        genre = req.body.genre,
        director = req.body.director,
        studio = req.body.studio,
        synopsis = req.body.synopsis,
        poster = req.body.poster,
        actors = req.body.actors,
        rating = req.body.rating,
        age = req.body.age;
    Film.find({"name" : name,
    "genre" : genre,
    "director" : director,
    "studio" : studio,
    "synopsis" : synopsis,
    "poster" : poster,
    "actors" : actors,
    "age" : age}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0)
            res.status(501).send("FILM IS ALREADY ADDED");
        else {
            let newFilm = new Film({"name" : name,
                "genre" : genre,
                "director" : director,
                "studio" : studio,
                "synopsis" : synopsis,
                "poster" : poster,
                "actors" : actors,
                "rating" : rating,
                "age" : age});
            newFilm.save(function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else res.status(200).json(result);
            });
        }
    });
};

FilmController.update = function (req, res) {
    console.log(this.name);
    let newFilm = {
        $set: {
            name: req.body.name,
            genre: req.body.genre,
            director: req.body.director,
            studio: req.body.studio,
            synopsis: req.body.synopsis,
            poster: req.body.poster,
            actors: req.body.actors,
            rating: req.body.rating,
            age: req.body.age
        }
    };
    Film.updateOne({"_id" : req.params.id}, newFilm, function (err, film) {
        if (err) res.status(500).json(err);
        else {
            if (film.n === 1 && film.nModified === 1 && film.ok === 1) {
                console.log("CHANGED");
                res.status(200).json(film);
            } else res.status(404).json("NOT FOUND");
        }
    });
};

FilmController.destroy = function (req, res) {
    console.log(this.name);
    let id = req.params.id;
    Film.find({"_id" : id}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0) {
            console.log("DELETE ALL SESSIONS WITH THIS FILM : " + result[0].name);
            Session.deleteMany({"filmID" : id}, function (err, session) {
                console.log("DELETING FILM...");
                Film.deleteOne({"_id" : id}, function (err, film) {
                    if (err) res.status(500).json(err);
                    else {
                        if (film.n === 1 && film.ok === 1 && film.deletedCount === 1)
                            res.status(200).json(film);
                        else res.status(404).json({"status" : 404});
                    }
                });
            });
        } else res.status(404).send("NOT FOUND");
    });
};

module.exports = FilmController;