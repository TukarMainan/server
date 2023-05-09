const { validate: uuidValidate } = require('uuid');
const { Comment } = require("../models");

class CommentController {
  static async createByUserId(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { message, PostId } = req.body;

      if (!message || !PostId) throw { name: "BadRequest" };
      if (!uuidValidate(PostId)) throw { name: "PostNotFound" };

      await Comment.create({
        UserId,
        PostId,
        message,
      });

      res.status(201).json({ message: "Success creating comment" });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "CommentController: createByUserId";
      next(err);
    }
  }
}

module.exports = CommentController;
