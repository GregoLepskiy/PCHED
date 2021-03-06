let Session = require("../models/session"),
    Film = require("../models/film"),
    Hall = require("../models/hall"),
    Place = require("../models/place"),
    Row = require("../models/row"),
    SessionController = {};

SessionController.index = function (req, res) {
    console.log(this.name);
    let filmID = req.params.filmID || null,
        hallID = req.params.hallID || null,
        sessionID = req.params.id || null,
        respondWithSessions = function (query) {
            Session.find(query, function (err, session) {
               if (err) res.status(500).json(err);
               else res.status(200).json(session);
            });
        };
    if (filmID !== null && hallID !== null)
        Film.find({"_id" : filmID}, function (err, films) {
            if (err) res.status(500).json(err);
            else if (films.length === 0) res.status(404).json({"films_length" : 0});
            else
                Hall.find({"_id" : hallID}, function (err, halls) {
                    if (err) res.status(500).json(err);
                    else if (halls.length === 0) res.status(404).json({"halls_length" : 0});
                    else
                        if (sessionID === null) respondWithSessions({"filmID" : films[0]._id,
                                                                            "hallID" : halls[0]._id});
                        else respondWithSessions({"filmID" : films[0]._id,
                            "hallID" : halls[0]._id,
                            "_id" : sessionID});
                });
        });
    else if (filmID !== null)
        Film.find({"_id" : filmID}, function (err, films) {
            if (err) res.status(500).json(err);
            else if (films.length === 0) res.status(404).json({"films_length" : 0});
            else
                if (sessionID === null) respondWithSessions({"filmID" : films[0]._id});
                else respondWithSessions({"filmID" : films[0]._id,
                    "_id" : sessionID});
        });
    else if (hallID !== null)
        Hall.find({"_id" : hallID}, function (err, halls) {
            if (err) res.status(500).json(err);
            else if (halls.length === 0) res.status(404).json({"halls_length" : 0});
            else
            if (sessionID === null) respondWithSessions({"hallID" : halls[0]._id});
            else respondWithSessions({"hallID" : halls[0]._id,
                "_id" : sessionID});
        });
    else if (sessionID !== null) respondWithSessions({"_id" : sessionID});
    else respondWithSessions({});
};

SessionController.create = function (req, res) {
    console.log(this.name);
    let hallID = req.body.hallID || null,
        filmID = req.body.filmID || null,
        time = req.body.time,
        newSession = new Session({
            "hallID" : hallID,
            "filmID" : filmID,
            "time" : time
        });
    Film.find({"_id" : filmID}, function (err, result) {
        if (err) res.status(500).json(err);
        else {
            if (result.length === 0) {
                res.status(404).json("FILM NOT FOUND");
                return;
            }
            Hall.find({"_id" : hallID}, function (err, hallResult) {
                if (err) res.status(500).json(err);
                else {
                    if (hallResult.length === 0) {
                        res.status(404).json("HALL NOT FOUND");
                        return;
                    }
                    newSession.save(function (err, result) {
                        if (err) res.status(500).json(err);
                        else {
                            console.log(result);
                            Row.find({"hallID" : hallResult[0]._id}, function (err, rowResult) {
                                rowResult.forEach(function (row) {
                                    Place.updateMany({"rowID" : row._id}, {
                                        $push: {
                                            "reservation": {
                                                "session": result._id,
                                                "res": false
                                            }
                                        }
                                    }, function (err, placeResult) {
                                        if (err) res.status(500).json(err);
                                        console.log(placeResult);
                                    });
                                });
                            });
                            res.status(200).json(result);
                        }
                    });
                }
            });
        }
    });
};

SessionController.destroy = function (req, res) {
    console.log(this.name);
    let id = req.params.id;
    Place.updateMany({
            "reservation": {
                $elemMatch : {
                    "session" : id
                }
            }
        },
        {
            $pull : {
                "reservation" : {
                    "session" : id
                }
            }
        }, function (err, result) {
            if (err) res.status(500).json(err);
            console.log(result);
        });
    Session.deleteOne({
        "_id" : id
    }, function (err, session) {
        if (err) res.status(500).json(err);
        else {
            if (session.n === 1 && session.deletedCount === 1 && session.ok === 1)
                res.status(200).json(session);
            else res.status(404).json({"status" : 404});
        }
    });
};

SessionController.update = function (req, res) {
    console.log(this.name);
    let id = req.params.id,
        newSessionData = {
            $set: {
                time : req.body.time
            }
        };
    Session.updateOne({"_id" : id}, newSessionData, function (err, session) {
        if (err) res.status(500).json(err);
        else {
            if (session.n === 1 && session.nModified === 1 && session.ok === 1) {
                console.log("CHANGED");
                res.status(200).json(session);
            } else res.status(404).json("NOT FOUND");
        }
    });
};

//TODO: sessionController

module.exports = SessionController;