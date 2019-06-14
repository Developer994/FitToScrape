// dependencies
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan")

// Intializing the express app
var express = require("express");
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(process.cwd() + "/public"));

// For using the handlebars as the viewing engine
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultlayout: "main" }));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// To connect to the mLab on Heroku, we do the following:
var db = mongoose.connection;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to Mongoose!")
});


var routes = require("./controller/controller.js");
app.use("/", routes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Port is listening on ${port}`)
});

