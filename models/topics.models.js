const db = require("../db/connection");

exports.selectTopics = async () => {
  try {
    const { rows } = await db.query("SELECT * FROM topics");
    return rows;
  } catch (err) {
    return Promise.reject(err);
  }
};
