const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { badPath } = require("./controllers/app.controllers");
const app = express();
app.use(express.json());

// End Points
app.get("/api/topics", getTopics);

app.all("/*", badPath)
module.exports = app;


// Error Handling
