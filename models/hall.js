let mongoose = require("mongoose"),
    HallSchema = mongoose.Schema({
        numb : Number,
        placeCount : Number,
        rowCount : Number
    }),
    Hall = mongoose.model("Hall", HallSchema);
module.exports = Hall;