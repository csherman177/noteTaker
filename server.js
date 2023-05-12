// Bring in the modules
const express = require("express");
const fs = require("fs");
const path = require("path");
let database = require("./db/db.json")
const { v4: uuidv4 } = require('uuid');


// Express App Setup
var app = express();
var PORT =process.env.PORT || 3000;

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Get the notes API path
app.get("/", function (req,res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req,res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.get("/api/notes", function(req,res) {
        res.json(database)
    });

app.post("/api/notes", function (req,res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;

newNote.id =  uuidv4();
database.push(newNote)

fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

    if (err) {
        return console.log(err);
    }
    console.log("Your note was saved!");
    return res.json(newNote);
});

});



app.delete("/api/notes/:id", function (req,res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");

    for (let i = 0; i< database.length; i++) {
        if (database[i].id == req.params.id) {
            database.splice(i,1);
            break;
        }
    }
    fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
            return res.json(database);
        }
    });
    
})





app.listen(PORT, function () {
console.log("App listening on PORT " + PORT);
});




