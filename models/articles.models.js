const db = require("../db/connection");

exports.selectSingleArticle = async (article_id) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM articles WHERE article_id = $1",
      [article_id]
    );
    return !rows.length
      ? Promise.reject({ status: 404, msg: "Article not found" })
      : rows[0];
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.selectArticles = async () => {
  try {
    const { rows } = await db.query(`
    SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comment_id)::INT AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  }
};
