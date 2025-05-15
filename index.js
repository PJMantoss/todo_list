const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

var items = [];
var example = "working";
app.get("/", function(req, res){
    res.render("list", {exej: example})
});

app.post("/", function(req, res){
    var item = req.body.ele1;
    items.push(item);
    res.redirect("/");
});

app.listen(8000, function(){
    console.log("Server Started!");
});