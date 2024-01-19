const {
  getUsers,
  getUserByUsername,
  postUser,
  deleteUserByUsername,
  patchUserByUsername,
} = require("../controllers/users.controllers");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers).post(postUser);
userRouter
  .route("/:username")
  .get(getUserByUsername)
  .patch(patchUserByUsername)
  .delete(deleteUserByUsername);

module.exports = userRouter;
