const db = require("../db/connection");
const format = require("pg-format");

exports.checkExists = async (table, column, value, errorRef) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1", table, column);
  const { rows } = await db.query(queryStr, [value]);
  if (!rows.length)
    return Promise.reject({ status: 404, msg: `${errorRef} not found` });
};
