const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT * FROM users");
  return rows;
};

exports.selectUserByUsername = async (username) => {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return !rows.length
    ? Promise.reject({ status: 404, msg: "User not found" })
    : rows[0];
};

exports.insertUser = async (newUser) => {
  const { username, name, avatar_url } = newUser;
  if (username && !username.match(/^[a-z0-9_-]{3,}$/g))
    return Promise.reject({ status: 400, msg: "Username Invalid" });
  const { rows } = await db.query(
    "INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3) RETURNING *",
    [username, name, avatar_url]
  );
  return rows[0];
};

exports.updateUserByUsername = async (username, updateUserData) => {
  const { name, avatar_url } = updateUserData;
  const queryValues = [username, name];
  let SqlQuery = "UPDATE users SET name = $2";
  if (avatar_url) {
    SqlQuery += ", avatar_url = $3";
    queryValues.push(avatar_url);
  }
  SqlQuery += "WHERE username = $1 RETURNING *";
  const { rows } = await db.query(SqlQuery, queryValues);
  return !rows.length
    ? Promise.reject({ status: 404, msg: "User not found" })
    : rows[0];
};

exports.removeUserByUsername = async (username) => {
  const { rows } = await db.query(
    "DELETE FROM users WHERE username = $1 RETURNING *",
    [username]
  );
  if (!rows.length)
    return Promise.reject({ status: 404, msg: "User not found" });
};
