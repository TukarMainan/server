class CommentController {
  static async createByUserId(req, res, next) {
    try {
      const { id } = req.user;
      const { message, PostId } = req.body;

      if (!message || !PostId) throw { name: "BadRequest" };

      const comment = {
        UserId: id,
        PostId,
        message,
      };

      await Comment.create(comment);

      res.status(201).json({ message: " Success creating comment" });
    } catch (err) {
      console.log("err :", err);
      err.ERROR_FROM_CONTROLLER = "CommentController: createByUserId";
      next(err);
    }
  }
}

module.exports = CommentController;
