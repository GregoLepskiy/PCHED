let Client = require("../models/client"),
    ClientController = {};

Client.find({}, function (err, result) {
    if (err) {
        console.log("ERROR: CLIENT.FIND");
        console.log(err);
    } else if (result.length === 0) {
        console.log("NEW CLIENT CREATION");
        let exampleClient = new Client({"name" : "newClient",
                                             "surname" : "newClientOf",
                                             "telephone" : "8-800-555-35-35",
                                             "email" : "newClientov@huh.com",
                                             "regisDate" : new Date("2021-11-13T00:00:00Z"),
                                             "birthDate" : new Date("2000-05-17T00:00:00Z")});
        exampleClient.save(function (err) {
            if (err) console.log(err);
            else console.log("TEST CLIENT SAVED");
        });
    }
});

ClientController.index = function (req, res) {
    console.log(this.name);
    let email = req.params.email || null,
        respondWithClients = function (query) {
            Client.find(query, function (err, client) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(client);
                }
            });
        };
    if (email !== null)
        respondWithClients({"email" : email});
    else
        respondWithClients({});
};

ClientController.show = function (req, res) {
    console.log(this.name);
    Client.find({"email" : req.params.email}, function (err, clients) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (clients.length !== 0) {
                res.sendfile("../client/admin.html");
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

ClientController.create = function (req, res) {
    console.log(this.name);
    let name = req.body.name,
        surname = req.body.surname,
        telephone = req.body.telephone,
        email = req.body.email,
        regisDate = req.body.regisDate,
        birthDate = req.body.birthDate;
    Client.find({"email" : email}, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else if (result.length !== 0) {
            res.status(501).send("CLIENT IS ALREADY HERE");
        } else {
            let newClient = new Client({"name" : name,
                "surname" : surname,
                "telephone" : telephone,
                "email" : email,
                "regisDate" : regisDate,
                "birthDate" : birthDate});
            newClient.save(function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.status(200).json(result);
                }
            });
        }
    });
};

ClientController.update = function (req, res) {
    console.log(this.name);
    let email = req.params.email,
        newClientData = {$set : {
                name : req.body.name,
                surname : req.body.surname,
                telephone : req.body.telephone,
                regisDate : req.body.regisDate,
                birthDate : req.body.birthDate
            }
    };
    Client.updateOne({"email" : email}, newClientData, function (err, client) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (client.n === 1 && client.nModified === 1 && client.ok === 1) {
                console.log("SUCCESSFUL");
                res.status(200).json(client);
            } else {
                res.status(404).json("NOT FOUND");
            }
        }
    });
};

ClientController.destroy = function (req, res) {
    console.log(this.name);
    let id = req.params.id;
    Client.deleteOne({"_id" : id}, function (err, client) {
        if (err) {
            res.status(500).json(err);
        } else {
            if (client.n === 1 && client.deletedCount === 1 && client.ok === 1) {
                console.log("DELETED FROM LIST");
                res.status(200).json(client);
            } else {
                res.status(404).json({"status" : 404});
            }
        }
    });
};

module.exports = ClientController;