let Place = require("../models/place"),
    Row = require("../models/row"),
    PlaceController = {};

PlaceController.index = function (req, res) {
    console.log(this.name);
    let rowID = req.params.rowID || null,
        placeID = req.params.id || null,
        respondWithPlaces = function (query) {
            Place.find(query, function (err, place) {
                if (err) res.status(500).json(err);
                else res.status(200).json(place);
            });
        };
    if (rowID !== null)
        Row.find({"_id" : rowID}, function (err, result) {
            if (err) res.status(500).json(err);
            else if (result.length === 0)
                res.status(404).json({"result_length" : 0});
            else {
                if (placeID === null) respondWithPlaces({"rowID" : result[0]._id});
                else respondWithPlaces({"_id" : placeID,
                                            "rowID" : result[0]._id});
            }
        });
    else if (placeID !== null) respondWithPlaces({"_id" : placeID});
    else respondWithPlaces({});
};

PlaceController.create = function (req, res) {
    let rowID = req.body.rowID,
        price = req.body.price,
        reservation = req.body.reservation,
        number = req.body.number,
        newPlace = new Place({
            "price" : price,
            "reservation" : reservation,
            "number" : number,
            "rowID" : rowID
        });
    Row.find({"_id" : rowID}, function (err, result) {
        if (err) res.status(500).json(err);
        else if (result.length === 0) res.status(404).json("ROW IS NOT FOUND");
        else newPlace.save(function(err, result) {
                if (err) res.status(500).json(err);
                else res.status(200).json(result);
            });
    });
};

PlaceController.update = function (req, res) {
    console.log(this.name);
    let id = req.params.id,
        newPlaceData = {
            $set: {
                "price": req.body.price
            }
        };
    Place.updateOne({"_id" : id}, newPlaceData,
        function (err, place) {
            if (err) res.status(500).json(err);
            else {
                if (place.n === 1 && place.nModified === 1 && place.ok === 1) {
                    console.log("CHANGED");
                    res.status(200).json(place);
                } else res.status(404).json("NOT FOUND");
            }
        });
};

PlaceController.updateReservation = function (req, res) {
    console.log(this.name);
    let id = req.params.id,
        sessionID = req.params.session,
        newPlaceData = {
            $set: {
                "reservation.$.res" : req.body.res
            }
        };
    Place.updateOne({
        "_id" : id,
        "reservation": {
            $elemMatch: {
                "session": sessionID
            }
        }
    }, newPlaceData, function (err, place) {
        if (err) res.status(500).json(err);
        else {
            if (place.n === 1 && place.nModified === 1 && place.ok === 1) {
                console.log("CHANGED");
                res.status(200).json(place);
            } else res.status(404).json("NOT FOUND");
        }
    });
};

//TODO: placeController

module.exports = PlaceController;