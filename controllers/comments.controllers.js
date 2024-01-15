const app = require("../app");
const { selectCommentsByArticle } = require("../models/comments.models");

exports.getCommentsByArticle = async (req, res, next) => {
  try {
    const comments = await selectCommentsByArticle(req.params.article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
