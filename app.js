const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { badPath, getEndpoints } = require("./controllers/app.controllers");
const {
  getSingleArticle,
  getArticles,
} = require("./controllers/articles.controllers");
const { getCommentsByArticle } = require("./controllers/comments.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const app = express();
app.use(express.json());

// End Points
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getSingleArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.all("/*", badPath);

// Error Handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

// Export
module.exports = app;
