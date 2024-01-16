const db = require("../db/connection");

exports.selectSingleArticle = async (article_id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [article_id]
  );
  return !rows.length
    ? Promise.reject({ status: 404, msg: "Article not found" })
    : rows[0];
};

exports.selectArticles = async () => {
  const { rows } = await db.query(`
    SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url,
    COUNT(comment_id)::INT AS comment_count
    FROM articles
    JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `);
  return rows;
};

exports.updateSingleArticle = async (inc_votes, article_id) => {
  const { rows } = await db.query(
    `UPDATE articles SET 
      votes = votes + $1 
      WHERE article_id = $2
      RETURNING *`,
    [inc_votes, article_id]
  );
  return !rows.length
    ? Promise.reject({ status: 404, msg: "Article not found" })
    : rows[0];
};
