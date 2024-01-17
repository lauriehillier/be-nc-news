const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");

exports.selectSingleArticle = async (article_id) => {
  const { rows } = await db.query(
    `SELECT articles.*, 
    COUNT(comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
    [article_id]
  );
  return !rows.length
    ? Promise.reject({ status: 404, msg: "Article not found" })
    : rows[0];
};

exports.selectArticles = async (
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  if (!["created_at", "votes", "comment_count"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }
  const queryValues = [];
  let queryStr = `SELECT 
  articles.article_id, 
  articles.author, 
  title, 
  topic, 
  articles.created_at, 
  articles.votes, 
  article_img_url,
  COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  if (topic) {
    await checkExists("topics", "slug", topic, "Topic");
    queryValues.push(topic);
    queryStr += " WHERE topic = $1";
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  const { rows } = await db.query(queryStr, queryValues);
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
