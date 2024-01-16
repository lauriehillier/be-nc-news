const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { badPath, getEndpoints } = require("./controllers/app.controllers");
const {
  getSingleArticle,
  getArticles,
  patchSingleArticle,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
  deleteCommentById,
} = require("./controllers/comments.controllers");
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
app.patch("/api/articles/:article_id", patchSingleArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.all("/*", badPath);

// Error Handling
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

// Export
module.exports = app;
