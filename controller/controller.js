var express = require("express");
var router = express.Router();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var Note = require("../models/Notes.js");
var Article = require("../models/Article.js");

router.get("/", function (req, res) {
    res.render("/articles");
});

router.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/issue/todayspaper/2019/06/09/todays-new-york-times").then(function (response) {
        var $ = cheerio.load(response.data);
        var titlesArray = [];

        $("css-195cszl e1f68otr0").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    Article.count({ title: result.title }, function (err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            entry.save(function (err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            });
                        }
                    });
                } else {
                    console.log("Article already exists.");
                }
            } else {
                console.log("Not saved to DB, missing data");
            }
        });
        res.redirect("/");
    });
});

router.get("/articles", function (req, res) {
    Article.find().sort({ _id: -1 }).exec(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var artcl = { article: doc };
            res.render("index", artcl)
        }
    });
});

// This routes gets the article scraped from Mongodb to json.
router.get("/article-json", function (req, res) {
    Article.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    })
})

module.exports = router;