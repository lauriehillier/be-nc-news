const fs = require("fs/promises");

exports.badPath = (req, res) => {
  res.status(400).send({ msg: "Invalid Path" });
};

exports.getEndpoints = async (req, res) => {
  try {
    const data = await fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");
    const endpoints = JSON.parse(data);
    res.status(200).send({ endpoints });
  } catch (err) {
    nextTick(err);
  }
};
