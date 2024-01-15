const { readEndpoints } = require("../models/app.models");


exports.badPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.getEndpoints = async (req, res, next) => {
  try {
    const endpoints = await readEndpoints()
    res.status(200).send({ endpoints });
  } catch (err) {
    next(err);
  }
};
