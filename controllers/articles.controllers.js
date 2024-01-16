const app = require("../app");
const {
  selectSingleArticle,
  selectArticles,
  updateSingleArticle,
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
  try {
    const articles = await selectArticles();
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
