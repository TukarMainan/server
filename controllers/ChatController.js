const { Chat } = require("../models");
const { validate: uuidValidate } = require('uuid');

class ChatController {
    static async readAllByUserId(req, res, next) {
        try {
            const { id: UserId } = req.user;

            const chats = await Chat.findAll({
                where: { SenderId: UserId }
            });

            res.status(200).json(chats);
        } catch (err) {
            console.log("err :", err);
            err.ERROR_FROM_CONTROLLER = "ChatController: readAll";
            next(err);
        }
    }

    static async createByUserId(req, res, next) {
        try {
            const { id: SenderId } = req.user;
            const { ReceiverId } = req.body;
            if (!SenderId || !ReceiverId) throw { name: "BadRequest" };

            const [chat, created] = await Chat.findOrCreate({
                where: { SenderId, ReceiverId },
                defaults: {
                    SenderId,
                    ReceiverId
                }
            });

            if (created) {
                res.status(201).json({ message: "Success creating new chat" });
            } else {
                res.status(204).json({ message: "Chat already exists" })
            }
        } catch (err) {
            console.log("err :", err);
            err.ERROR_FROM_CONTROLLER = "ChatController: createByUserId";
            next(err);
        }
    }
}

module.exports = ChatController;
