const app = require("../app");
const {
  selectSingleArticle,
  selectArticles,
  updateSingleArticle,
  insertArticle,
} = require("../models/articles.models");

exports.getSingleArticle = async (req, res, next) => {
  try {
    const article = await selectSingleArticle(req.params.article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  try {
    const articles = await selectArticles(topic, sort_by, order);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.patchSingleArticle = async (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  try {
    const article = await updateSingleArticle(inc_votes, article_id);
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