const {
  getUsers,
  getUserByUsername,
  postUser,
} = require("../controllers/users.controllers");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
