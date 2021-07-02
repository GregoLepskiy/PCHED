let mongoose = require("mongoose"),
    ObjectID = mongoose.Schema.Types.ObjectId,
    RowSchema = mongoose.Schema({
        placeCount : Number,
        number : Number,
        hallID : ObjectID
    }),
    Row = mongoose.model("Row", RowSchema);
module.exports = Row;