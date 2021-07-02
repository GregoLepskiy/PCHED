let Row = require("../models/row"),
    Hall = require("../models/hall"),
    Place = require("../models/place"),
    RowController = {};

RowController.index = function (req, res) {
    console.log(this.name);
    let hallID = req.params.hallID || null,
        rowID = req.params.id || null,
        respondWithRows = function (query) {
            Row.find(query, function (err, row) {
                if (err) res.status(500).json(err);
                else res.status(200).json(row);
            });
        };
    if (hallID !== null)
        Hall.find({"_id" : hallID}, function (err, result) {
            if (err) res.status(500).json(err);
            else if (result.length === 0)
                res.status(404).json({"result_length" : 0});
            else {
                if (rowID === null) respondWithRows({"hallID" : result[0]._id});
                else respondWithRows({"_id" : rowID,
                                            "hallID" : hallID});
            }
        });
    else if (rowID !== null) respondWithRows({"_id" : rowID});
    else respondWithRows({});
};

RowController.create = function (req, res) {
    console.log(this.name);
    let hallID = req.body.hallID,
        placeCount = req.body.placeCount,
        number = req.body.number,
        newRow = new Row({
            "hallID" : hallID,
            "placeCount" : placeCount,
            "number" : number
        });
    Hall.find({"_id" : hallID}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length === 0) res.status(404).json("HALL IS NOT FOUND");
        else newRow.save(function (err, result) {
                if (err) res.status(500).json(err);
                else res.status(200).json(result);
            });
    });
};

//TODO: rowController

module.exports = RowController;