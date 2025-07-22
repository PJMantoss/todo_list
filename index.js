const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// --- Express App Setup ---
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- MongoDB Connection and Schema Definition ---

// ToDo Later: Store your connection string in an environment variable.
// Example: const dbURI = process.env.MONGO_URI;
const dbURI = "mongodb+srv://joelptoss:holy@cluster0.n7azmij.mongodb.net/todo";

// Define the schema to match the data structure used in the app
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    }
});

// Create the Mongoose model
const Todo = mongoose.model("Todo", todoSchema);

// Define available priorities for dropdowns
const priorities = ["High", "Medium", "Low"];

// --- Route Handlers ---

// --- Main page: Display items from DB, handle filtering ---
app.get("/", async (req, res) => {
    try {
        const priorityFilter = req.query.priority;
        const errorMessage = req.query.error;

        // Build a query object. If no filter or "All" is selected, the query object is empty, fetching all items.
        const query = {};
        if (priorityFilter && priorityFilter !== "All") {
            query.priority = priorityFilter;
        }

        // Fetch items from the database based on the filter query
        const itemsToDisplay = await Todo.find(query);

        res.render("list", {
            ejes: itemsToDisplay,
            priorities: priorities,
            selectedPriority: priorityFilter || "All",
            errorMessage: errorMessage === "emptyInput" ? "Task text cannot be empty!" : null,
            infoMessage: req.query.info
        });

    } catch (error) {
        console.error("Error fetching ToDo items:", error);
        res.status(500).send("An error occurred while fetching ToDo items.");
    }
});

// --- Adding new item to ToDo List and saving to DB ---
app.post("/add", async (req, res) => {
    try {
        const itemText = req.body.ele1;
        const itemPriority = req.body.priority;

        // Validate input
        if (!itemText || itemText.trim() === "") {
            res.redirect("/?error=emptyInput");
            return;
        }

        // Create a new Todo document
        const newTodo = new Todo({
            text: itemText.trim(),
            priority: itemPriority || "Medium"
        });

        // Save the new document to the database
        await newTodo.save();

        // Redirect back to the list, preserving the filter
        const currentFilter = req.body.currentFilter ? `?priority=${req.body.currentFilter}` : "";
        res.redirect(`/${currentFilter}`);

    } catch (error) {
        console.error("Error adding ToDo item:", error);
        res.status(500).send("An error occurred while adding the item.");
    }
});

// --- Deleting an item from the DB ---
app.post("/delete", async (req, res) => {
    try {
        const itemIdToDelete = req.body.itemId;
        
        // Find the item by its ID and remove it from the database
        await Todo.findByIdAndDelete(itemIdToDelete);

        // Redirect back to the list, preserving the filter
        const currentFilter = req.body.currentFilter ? `?priority=${req.body.currentFilter}` : "";
        res.redirect(`/${currentFilter}`);

    } catch (error) {
        console.error("Error deleting ToDo item:", error);
        res.status(500).send("An error occurred while deleting the item.");
    }
});

// --- Show Edit Page for a specific item ---
app.get("/edit/:itemId", async (req, res) => {
    try {
        const itemIdToEdit = req.params.itemId;
        
        // Find the item in the database by its ID
        const item = await Todo.findById(itemIdToEdit);
        const currentFilter = req.query.currentFilter || "All";

        if (item) {
            res.render("edit_item", {
                item: item,
                priorities: priorities,
                currentFilter: currentFilter
            });
        } else {
            // If item is not found, redirect to the homepage
            res.redirect("/");
        }

    } catch (error) {
        console.error("Error finding item to edit:", error);
        res.redirect("/");
    }
});

// --- Connect to DB and Start Server ---
const startServer = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Successfully connected to MongoDB Atlas!");
        
        app.listen(8000, () => {
            console.log("Server Started on port 8000!");
        });

    } catch (error) {
        console.error("Error connecting to MongoDB Atlas. Server not started.", error);
        process.exit(1); // Exit the process with an error code
    }
};

startServer();