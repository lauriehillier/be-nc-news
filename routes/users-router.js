const {
  getUsers,
  getUserByUsername,
  postUser,
  patchUserById,
} = require("../controllers/users.controllers");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:username").get(getUserByUsername).patch(patchUserById);

module.exports = userRouter;
