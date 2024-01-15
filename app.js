const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { badPath, getEndpoints } = require("./controllers/app.controllers");
const app = express();
app.use(express.json());

// End Points
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);

app.all("/*", badPath)
module.exports = app;


// Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Whoops... Internal Server Error" });
  });