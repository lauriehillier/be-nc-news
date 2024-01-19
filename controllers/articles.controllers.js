const app = require("../app");
const {
  selectArticles,
  insertArticle,
  removeArticleById,
  updateArticleById,
  selectArticleById,
} = require("../models/articles.models");

exports.getArticleById = async (req, res, next) => {
  try {
    const article = await selectArticleById(req.params.article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { topic, sort_by, order, limit, p} = req.query;
  try {
    const articles = await selectArticles(topic, sort_by, order, limit, p);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  try {
    const article = await updateArticleById(inc_votes, article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const newArticle = req.body
  try {
    const article = await insertArticle(newArticle);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    await removeArticleById(article_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};