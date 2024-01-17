const {
  getArticles,
  getSingleArticle,
  patchSingleArticle,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
} = require("../controllers/comments.controllers");

const articleRouter = require("express").Router();

articleRouter.get("/", getArticles);
articleRouter
.route("/:article_id")
.get(getSingleArticle)
.patch(patchSingleArticle);
articleRouter
.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(postCommentByArticle);

module.exports = articleRouter;
