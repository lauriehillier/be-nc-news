const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");

exports.selectCommentsByArticle = async (article_id) => {
  await checkExists("articles", "article_id", article_id, "Article");
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC",
    [article_id]
  );
  return rows;
};

exports.insertCommentByArticle = async (article_id, newComment) => {
  const { username, body } = newComment;
  if (!body) return Promise.reject({ status: 400, msg: "Empty Comment" });
  await checkExists("articles", "article_id", article_id, "Article");
  await checkExists("users", "username", username, "User");
  const { rows } = await db.query(
    `
        INSERT INTO comments
        (article_id, author, body)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
    [article_id, username, body]
  );
  return rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const { rows } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
    [comment_id]
  );
  if (!rows.length)
    return Promise.reject({ status: 404, msg: "Comment not found" });
};

exports.updateCommentById = async (inc_votes, comment_id) => {
  const { rows } = await db.query(
    `UPDATE comments SET 
      votes = votes + $1 
      WHERE comment_id = $2
      RETURNING *`,
    [inc_votes, comment_id]
  );
  return !rows.length
    ? Promise.reject({ status: 404, msg: "Comment not found" })
    : rows[0];
};
