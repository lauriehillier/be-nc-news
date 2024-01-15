const db = require("../db/connection");

exports.selectSingleArticle = async (article_id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM articles WHERE article_id = $1",
      [article_id]
    );
    return (!rows.length) ? Promise.reject({ status: 404, msg: "Article not found" }) : rows[0];
  } catch (err) {
    return Promise.reject(err);
  }
};
