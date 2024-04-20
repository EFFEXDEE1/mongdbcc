const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = 8080;


// Read .env file and set environment variables
require('dotenv').config();
const random = Math.floor(Math.random() * 100);

// Use official mongodb driver to connect to the server
const { MongoClient, ObjectId } = require('mongodb');

// New instance of MongoClient with connection string
// for Cosmos DB
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
const collectionName = 'profs'
const dbName = 'profs'

async function connectToDB() {
    await client.connect();
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log('Mit MongoDB verbunden und Datenbank/Sammlung ausgewählt.');
}
connectToDB()

//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);


app.get('/profs', async(req, res) => {
    try {
        const profs = await collection.find().toArray();
        res.status(200).json(profs);
    } catch (err) {
        console.error('Fehler', err)
        res.status(500).json({error: 'Fehler'})
    }
})

app.get('/profs/:id', async (req, res) => {
    try {
        // ID aus den URL-Parametern erhalten
        const id = req.params.id;

        // ID in ein MongoDB-Objekt umwandeln
        const objectId = new ObjectId(id);

        // Dokument mit der entsprechenden ID aus der Sammlung finden
        const document = await collection.findOne({ _id: objectId });

        if (document) {
            // Dokument gefunden, als JSON zurückgeben
            res.status(200).json(document);
        } else {
            // Dokument nicht gefunden, Fehler zurückgeben
            res.status(404).json({ error: 'Dokument nicht gefunden' });
        }
    } catch (err) {
        console.error('Fehler:', err);
        res.status(500).json({ error: 'Ein Fehler ist aufgetreten' });
    }
});

app.put("/profs/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject[req.params.id].name = req.body.name;
        dataAsObject[req.params.id].rating = req.body.rating;
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});

app.delete("/profs/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.splice(req.params.id, 1);
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});

app.post("/profs", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.push({
            id: dataAsObject.length,
            name: req.body.name,
            rating: req.body.rating,
        });
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));