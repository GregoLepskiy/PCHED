let mongoose = require("mongoose"),
    ObjectID = mongoose.Schema.Types.ObjectId,
    SessionSchema = mongoose.Schema({
        hallID : ObjectID,
        filmID : ObjectID,
        time : String
    }),
    Session = mongoose.model("Session", SessionSchema);
module.exports = Session;