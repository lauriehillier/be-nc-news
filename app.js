const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { badPath, getEndpoints } = require("./controllers/app.controllers");
const { getSingleArticle } = require("./controllers/articles.controllers");
const app = express();
app.use(express.json());

// End Points
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getSingleArticle);
app.all("/*", badPath);

// Error Handling
app.use((err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
    else next(err)
  });
app.use((err, req, res, next) => {
    if(err.code) res.status(400).send({ msg: "Bad Request" });
    else next(err)
  });
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Whoops... Internal Server Error" });
});

// Export
module.exports = app;