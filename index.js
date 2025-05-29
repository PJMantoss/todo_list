const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

var items = [];
const priorities = ["High", "Medium", "Low"]; // Define available priorities
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

// Removing an item from the ToDo List
app.post("/delete", function(req, res){
    const itemIndexToDelete = parseInt(req.body.itemIndex, 10); // Get the index from the form
    
    // Validate the index
    if (!isNaN(itemIndexToDelete) && itemIndexToDelete >= 0 && itemIndexToDelete < items.length) {
        items.splice(itemIndexToDelete, 1); // Remove 1 item at the specified index
    } else {
        console.log("Attempted to delete item with invalid index:", req.body.itemIndex);
    }
    res.redirect("/"); // Redirect back to the homepage to see the updated list
});

app.listen(8000, function(){
    console.log("Server Started!");
});