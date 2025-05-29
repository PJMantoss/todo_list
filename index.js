const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

var items = [];
var example = "working";
app.get("/", function(req, res){
    res.render("list", {ejes: items})
});

//Adding new item to ToDo List
app.post("/", function(req, res){
    var item = req.body.ele1;
    items.push(item);
    res.redirect("/");
});

app.listen(8000, function(){
    console.log("Server Started!");
});