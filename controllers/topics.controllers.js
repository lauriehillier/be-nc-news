const { selectTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  const newTopic = req.body
  try {
    const topic = await insertTopic(newTopic);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};