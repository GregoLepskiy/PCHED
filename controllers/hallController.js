let Hall = require("../models/hall"),
    Row = require("../models/row"),
    Place = require("../models/place"),
    Session = require("../models/session"),
    HallController = {};

Hall.find({}, function (err, result) {
   if (err) console.log("ERROR: " + this.name, err);
   else if (result.length === 0) {
       console.log("NEW HALL CREATION");
       let exampleHall = new Hall({"numb" : -1,
                                       "placeCount" : 300,
                                       "rowCount" : 20});
       exampleHall.save(function (err) {
           if (err) console.log(err);
           else console.log("TEST HALL SAVED");
       });
   }
});

HallController.index = function (req, res) {
    console.log(this.name);
    let numb = req.params.numb || null,
        respondWithHall = function (query) {
            Hall.find(query, function (err, hall) {
                if (err) res.status(500).json(err);
                else res.status(200).json(hall);
            });
        };
    if (numb !== null) respondWithHall({"numb" : numb});
    else respondWithHall({});
};

HallController.create = function (req, res) {
    console.log(this.name);
    let numb = req.body.numb,
        placeCount = req.body.placeCount,
        rowCount = req.body.rowCount;
    Hall.find({
        "numb" : numb,
        "placeCount" : placeCount,
        "rowCount" : rowCount
    }, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0) res.status(501).send("HALL IS ALREADY HERE");
        else {
            let newHall = new Hall({
                "numb" : numb,
                "placeCount" : placeCount,
                "rowCount" : rowCount
            });
            newHall.save(function (err, result) {
                if (err) res.status(500).json(err);
                else res.status(200).json(result);
            });
        }
    });
};

HallController.destroy = function (req, res) {
    console.log(this.name);
    let id = req.params.id;
    Hall.find({"_id" : id}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length !== 0) {
            Row.find({"hallID": id},
                function (err, rows) {
                    if (err) res.status(500).json(err);
                    rows.forEach(function (row) {
                        Place.deleteMany({"rowID": row._id}, function (err, placeRes) {
                            console.log(placeRes);
                        });
                    });
                });
            Row.deleteMany({"hallID": result[0]._id},
                function (err, rows) {
                    if (err) res.status(500).json(err);
                    else {
                        Session.deleteMany({
                            "hallID": id
                        }, function (err, session) {
                            console.log(session);
                        });
                        Hall.deleteOne({"_id": id},
                            function (err, hall) {
                                if (err) res.status(500).json(err);
                                else {
                                    if (hall.n === 1 && hall.ok === 1 && hall.deletedCount === 1)
                                        res.status(200).json(hall);
                                    else res.status(404).json({"status": 404});
                                }
                            });
                    }
                });
        }
        else res.status(404).send("NOT FOUND");
    });
};

//TODO: HALLCONTROLLER

module.exports = HallController;