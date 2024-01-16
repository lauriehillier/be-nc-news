const db = require("../db/connection");
const { checkArticleExists } = require("../utils/check-exists");

exports.selectCommentsByArticle = async (article_id) => {
  try {
    await checkArticleExists(article_id)
    const { rows } = await db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC", [article_id]);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  }
};
