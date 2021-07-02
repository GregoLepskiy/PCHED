let Worker = require("../models/worker"),
    WorkerController = {};

Worker.find({}, function (err, result) {
    if (err) console.log ("ERROR: WORKER.FIND...\n", err);
    else if (result.length === 0) {
        console.log("NEW WORKER CREATION");
        let exampleWorker = new Worker({"name" : "Charles",
            "surname" : "LeChair",
            "patronymic" : "TableOf",
            "position" : "лежа",
            "role" : "бревно",
            "salary" : 16});
        exampleWorker.save(function (err) {
            if (err) console.log(err);
            else console.log("TEST WORKER SAVED");
        });
    }
});

WorkerController.index = function (req, res) {
    console.log(this.name);
    let id = req.params.id || null,
        respondWithWorkers = function (query) {
            Worker.find(query, function (err, worker) {
                if (err) res.status(500).json(err);
                else res.status(200).json(worker);
            });
        };
    if (id !== null) respondWithWorkers({"_id" : id});
    else respondWithWorkers({});
};

WorkerController.create = function (req, res) {
    console.log(this.name);
    let name = req.body.name,
        surname = req.body.surname,
        patronymic = req.body.patronymic,
        position = req.body.position,
        role = req.body.role,
        salary = req.body.salary;
    Worker.find({
        "name" : name,
        "surname" : surname,
        "patronymic" : patronymic,
        "position" : position,
        "role" : role,
        "salary" : salary
    }, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0)
            res.status(501).send("Worker is already consist");
        else {
            let newWorker = new Worker({
                "name" : name,
                "surname" : surname,
                "patronymic" : patronymic,
                "position" : position,
                "role" : role,
                "salary" : salary
            });
            newWorker.save(function (err, result) {
                console.log(err);
                if (err) res.status(500).json(err);
                else res.status(200).json(result);
            });
        }
    });
};

WorkerController.destroy = function (req, res) {
    console.log(this.name);
    let id = req.params.id;
    Worker.find({"_id" : id}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0)
            Worker.deleteOne({"_id" : id}, function (err, worker) {
                if (err) res.status(500).json(err);
                else {
                    if (worker.n === 1 && worker.ok === 1 && worker.deletedCount === 1)
                        res.status(200).json(worker);
                    else res.status(404).json({"status" : 404});
                }
            });
        else res.status(404).send("NOT FOUND");
    });
};

//TODO : WORKERCONTROLLER

module.exports = WorkerController;