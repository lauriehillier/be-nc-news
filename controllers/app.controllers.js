exports.badPath = (req, res) => {
  res.status(400).send({ msg: "Invalid Path" });
};
