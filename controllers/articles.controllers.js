const {
  selectSingleArticle,
  selectArticles,
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
