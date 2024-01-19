const {
  getArticles,
  getSingleArticle,
  patchSingleArticle,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const {
  getCommentsByArticle,
  postCommentByArticle,
} = require("../controllers/comments.controllers");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);
articleRouter
  .route("/:article_id")
  .get(getSingleArticle)
  .patch(patchSingleArticle)
  .delete(deleteArticleById);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postCommentByArticle);

module.exports = articleRouter;
