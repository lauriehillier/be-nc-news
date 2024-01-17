const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments.controllers");

const commentRouter = require("express").Router();

commentRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentRouter;
