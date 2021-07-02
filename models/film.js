let mongoose = require("mongoose"),
    FilmSchema = mongoose.Schema({
        name : String,
        genre : [String],
        director : String,
        studio : String,
        synopsis : String,
        poster : String,
        actors : [String],
        rating : Number,
        age : Number
    }),
    Film = mongoose.model("Film", FilmSchema);
module.exports = Film;