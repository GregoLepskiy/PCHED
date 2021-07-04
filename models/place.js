let mongoose = require("mongoose"),
    ObjectID = mongoose.Schema.Types.ObjectId,
    PlaceSchema = mongoose.Schema({
        price : Number,
        reservation : Boolean,
        number : Number,
        rowID : ObjectID
    }),
    Place = mongoose.model("Place", PlaceSchema);
module.exports = Place;