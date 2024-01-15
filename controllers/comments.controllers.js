const app = require("../app");
const {
  selectCommentsByArticle,
  insertCommentByArticle,
} = require("../models/comments.models");

exports.getCommentsByArticle = async (req, res, next) => {
  try {
    const comments = await selectCommentsByArticle(req.params.article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticle = async (req, res, next) => {
  try {
    const comment = await insertCommentByArticle(
      req.params.article_id,
      req.body
    );
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
