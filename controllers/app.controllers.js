const fs = require("fs/promises");

exports.badPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
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
