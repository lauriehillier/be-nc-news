const app = require("../app");
const {
  selectCommentsByArticle,
  insertCommentByArticle,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticle = async (req, res, next) => {
  try {
    const { article_id} = req.params
    const comments = await selectCommentsByArticle(article_id);
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

exports.deleteCommentById = async (req, res, next) => {
  const {comment_id} = req.params
  try {
    await removeCommentById(comment_id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}