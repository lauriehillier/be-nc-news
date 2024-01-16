const db = require("../db/connection");
exports.checkArticleExists = async (article_id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM articles WHERE article_id = $1",
      [article_id]
    );
    if (!rows.length) return Promise.reject({ status: 404, msg: "Article not found" });
  } catch (err) {
    return Promise.reject(err);
  }
};
