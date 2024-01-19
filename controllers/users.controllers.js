const {
  selectUsers,
  selectUserByUsername,
  insertUser,
  removeUserByUsername,
  updateUserByUsername,
} = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  const NewUser = req.body;
  try {
    const user = await insertUser(NewUser);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.patchUserByUsername = async (req, res, next) => {
  const updateUserData = req.body;
  const { username } = req.params;
  try {
    const user = await updateUserByUsername(username, updateUserData);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    await removeUserByUsername(username);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};