const fs = require("fs/promises");

exports.readEndpoints = async (req, res) => {
  const endpoints = await fs.readFile(
    `${__dirname}/../endpoints.json`,
    "utf-8"
  );
  return JSON.parse(endpoints);
};
