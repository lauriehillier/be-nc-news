const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");

exports.selectTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics");
  return rows;
};

exports.insertTopic = async (newTopic) => {
  const { slug, description } = newTopic;
  if (!slug)
    return Promise.reject({ status: 400, msg: "Bad Request: Missing Slug" });
  const { rows } = await db.query(
    "INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *",
    [slug, description]
  );
  return rows[0];
};
