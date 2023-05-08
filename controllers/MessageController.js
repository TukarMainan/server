const { Message, Chat } = require("../models");

class MessageController {
  static async readAllByUserId(req, res, next) {
    try {
      const { id } = req.user;

      const messages = await Message.findByAll(
        {
          include: [{ model: Chat, required: true }],
        },
        { where: { ChatId: id } }
      );

      res.status(200).json(messages);
    } catch (err) {
      console.log("err :", err);
      err.ERROR_FROM_CONTROLLER = "MessageController: readAllByUserId";
      next(err);
    }
  }

  static async createByUserId(req, res, next) {
    try {
    } catch (err) {
      console.log("err :", err);
      err.ERROR_FROM_CONTROLLER = "MessageController: createByUserId";
      next(err);
    }
  }
}

module.exports = MessageController;
