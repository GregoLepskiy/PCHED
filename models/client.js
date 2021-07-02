var mongoose = require("mongoose"),
    ClientSchema = mongoose.Schema({
        name : String,
        surname : String,
        telephone : String,
        email : String,
        regisDate : Date,
        birthDate : Date
    }),
    Client = mongoose.model("Client", ClientSchema);
module.exports = Client;