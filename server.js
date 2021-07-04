var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    clientsController = require("./controllers/clientController"),
    filmsController = require("./controllers/filmController"),
    workersController = require("./controllers/workerController"),
    hallsController = require("./controllers/hallController"),
    rowsController = require("./controllers/rowController"),
    placesController = require("./controllers/placeController"),
    sessionsController = require("./controllers/sessionController"),
    app = express(),
    port = process.env.PORT || null;
if (port === null || port === "") port = 3000;
console.log(port);

http.createServer(app).listen(port);
app.use(express.static(__dirname + "/client"));
app.use('/', express.static(__dirname + "/client"));
app.use('/films/:film_name', express.static(__dirname + "/client"));
app.use(express.urlencoded({extended : true}));
mongoose.connect('mongodb+srv://Irakliy:1704@cinema.x3urg.mongodb.net/myFirstDatabase', {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true
}).then(res => {
    console.log("DB is connected");
    console.log(res);
}).catch(err => {
    console.log(Error, err.message);
});

app.get("/clients.json", clientsController.index);
app.get("/films.json", filmsController.index);
app.get("/workers.json", workersController.index);
app.get("/halls.json", hallsController.index);
app.get("/:hallID/rows.json", rowsController.index);
app.get("/places/:rowID/places.json", placesController.index);
app.get("/:hallID/:filmID/sessions.json", sessionsController.index);
app.get("/:filmID/sessions.json", sessionsController.index);
app.get("/:hallID/sessions.json", sessionsController.index);
app.get("/sessions.json", sessionsController.index);

app.post("/clients", clientsController.create);
app.post("/films", filmsController.create);
app.post("/workers", workersController.create);
app.post("/sessions", sessionsController.create);
app.post("/halls", hallsController.create);
app.post("/rows", rowsController.create);
app.post("/places", placesController.create);

app.delete("/clients/:id", clientsController.destroy);
app.delete("/films/:id", filmsController.destroy);
app.delete("/workers/:id", workersController.destroy);
app.delete("/sessions/:id", sessionsController.destroy);
app.delete("/halls/:id", hallsController.destroy);

app.put("/:email", clientsController.update);