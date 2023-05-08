const { Chat } = require("../models");

class ChatController {
    static async readAllByUserId(req, res, next) {
        try {
            const { id: UserId } = req.user;

            const chat = await Chat.findAll({
                where: { SenderId: UserId }
            });

            res.status(200).json(chat);
        } catch (err) {
            console.log("err :", err);
            err.ERROR_FROM_CONTROLLER = "ChatController: readAll";
            next(err);
        }
    }

    static async createByUserId(req, res, next) {
        try {
            const { SenderId, ReceiverId } = req.body;
            if (!SenderId || !ReceiverId) throw { name: "BadRequest" };

            await Chat.create({
                SenderId,
                ReceiverId
            });

            res.status(201).json({ message: " Success creating new chat" });
        } catch (err) {
            console.log("err :", err);
            err.ERROR_FROM_CONTROLLER = "ChatController: createByUserId";
            next(err);
        }
    }
}

module.exports = ChatController;
