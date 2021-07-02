let mongoose = require("mongoose"),
    WorkerSchema = mongoose.Schema({
        name : String,
        surname : String,
        patronymic : String,
        position : String,
        role : String,
        salary : Number
    }),
    Worker = mongoose.model("Worker", WorkerSchema);
module.exports = Worker;