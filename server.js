var mongoose = require("mongoose");
var express = require("express");
var exphbs = require("express-handlebars");
var app = express();
var logger = require("morgan")


app.use(logger("dev"));
app.use(express.static(process.cwd() + "/public"));

// For using the handlebars as the viewing engine
app.engine("handlebars", exphbs({ defaultlayout: "main" }));
app.set("view engine", "handlebars");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// To connect to the mLab on Heroku, we do the following:
mongoose.connect("mongodb://User:Password994@ds135217.mlab.com:35217/heroku_l1fw1rvb", { useNewUrlParser: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to Mongoose!")
});
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Port is listening on ${port}`)
});

