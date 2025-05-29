const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

var items = [];
const priorities = ["High", "Medium", "Low"]; // Define available priorities

// --- Helper function to get filtered items ---
function getFilteredItems(currentItems, priorityFilter) {
    if (priorityFilter && priorityFilter !== "All") {
        return currentItems.filter(item => item.priority === priorityFilter);
    }
    return currentItems;
}

var example = "working";

// app.get("/", function(req, res){
//     res.render("list", {ejes: items})
// });

// --- Main page: Display items, handle filtering ---
app.get("/", function(req, res) {
    const priorityFilter = req.query.priority;
    const errorMessage = req.query.error; // For displaying errors passed via redirect

    let itemsToDisplay = getFilteredItems(items, priorityFilter);

    res.render("list", {
        ejes: itemsToDisplay,
        priorities: priorities, // Pass priorities for the filter dropdown
        selectedPriority: priorityFilter || "All", // For highlighting active filter
        errorMessage: errorMessage === "emptyInput" ? "Task text cannot be empty!" : null,
        infoMessage: req.query.info // For general messages like "Item added"
    });
});

// app.post("/", function(req, res){
//     var item = req.body.ele1;
//     items.push(item);
//     res.redirect("/");
// });

// --- Adding new item to ToDo List ---
app.post("/add", function(req, res) { // Changed route to /add for clarity
    const itemText = req.body.ele1;
    const itemPriority = req.body.priority;

    if (!itemText || itemText.trim() === "") {
        // Option 1: Redirect with error query param (simpler for state management)
        res.redirect("/?error=emptyInput");
        return;
    }

    items.push({
        id: Date.now().toString(), // Simple unique ID
        text: itemText.trim(),
        priority: itemPriority || "Medium" // Default priority if none selected
    });
    const currentFilter = req.body.currentFilter ? `?priority=${req.body.currentFilter}` : "";
    res.redirect(`/${currentFilter}`); // Redirect, potentially to the filtered view
});


// app.post("/delete", function(req, res){
//     const itemIndexToDelete = parseInt(req.body.itemIndex, 10); // Get the index from the form
    
//     // Validate the index
//     if (!isNaN(itemIndexToDelete) && itemIndexToDelete >= 0 && itemIndexToDelete < items.length) {
//         items.splice(itemIndexToDelete, 1); // Remove 1 item at the specified index
//     } else {
//         console.log("Attempted to delete item with invalid index:", req.body.itemIndex);
//     }
//     res.redirect("/"); // Redirect back to the homepage to see the updated list
// });

// --- Deleting an item from ToDo List ---
app.post("/delete", function(req, res) {
    const itemIdToDelete = req.body.itemId;
    items = items.filter(item => item.id !== itemIdToDelete); // Filter out the item to delete
    const currentFilter = req.body.currentFilter ? `?priority=${req.body.currentFilter}` : "";
    res.redirect(`/${currentFilter}`);
});

// --- Show Edit Page ---
app.get("/edit/:itemId", function(req, res) {
    const itemIdToEdit = req.params.itemId;
    const item = items.find(item => item.id === itemIdToEdit);
    const currentFilter = req.query.currentFilter || "All";


    if (item) {
        res.render("edit_item", {
            item: item,
            priorities: priorities,
            currentFilter: currentFilter
        });
    } else {
        res.redirect("/"); // Item not found
    }
});

app.listen(8000, function(){
    console.log("Server Started!");
});