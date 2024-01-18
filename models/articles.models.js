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
  order = "DESC",
  limit = 10,
  page = 1
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
  COUNT(comment_id)::INT AS comment_count,
  COUNT(*) OVER()::INT AS total_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  // WHERE
  if (topic) {
    await checkExists("topics", "slug", topic, "Topic");
    queryValues.push(topic);
    queryStr += " WHERE topic = $1";
  }
  // ORDER & GROUP BY
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  // OFFSET
  queryValues.push(page * limit - limit);
  queryStr += ` OFFSET $${queryValues.length}`;
  // LIMIT
  queryValues.push(limit);
  queryStr += ` LIMIT $${queryValues.length}`;
  // Execute
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

exports.insertArticle = async (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;
  if ([author, title, body, topic].includes(""))
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Missing Required Fields",
    });
  await checkExists("topics", "slug", topic, "Topic");
  await checkExists("users", "username", author, "User");
  const { rows } = await db.query(
    `
        INSERT INTO articles
        (author, title, body, topic, article_img_url)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
        `,
    [author, title, body, topic, article_img_url]
  );
  rows[0].comment_count = 0;
  return rows[0];
};
