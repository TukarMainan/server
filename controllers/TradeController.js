const { Trade, User, Post, Chat } = require("../models");
const { validate: uuidValidate } = require('uuid');

class TradeController {
    static async readBySender(req, res, next) {
        try {
            const { id } = req.user
            if (!uuidValidate(id)) throw { name: "UserNotFound" }
            const trades = await Trade.findAll({
                where: { SenderUserId: id },
                include: [
                    {
                        model: User,
                        as: "SenderUser",
                        attributes: {
                            exclude: ["password"]
                        }
                    },
                    {
                        model: Post,
                        as: "SenderPost"
                    },
                    {
                        model: Post,
                        as: "TargetPost"
                    }
                ]
            });
            res.status(200).json(trades);
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: readBySender";
            next(err);
        }
    }

    static async readByTarget(req, res, next) {
        try {
            const { id } = req.user
            if (!uuidValidate(id)) throw { name: "UserNotFound" };
            const trades = await Trade.findAll({
                where: { TargetUserId: id },
                include: [
                    {
                        model: User,
                        as: "SenderUser",
                        attributes: {
                            exclude: ["password"]
                        }
                    },
                    {
                        model: Post,
                        as: "SenderPost"
                    },
                    {
                        model: Post,
                        as: "TargetPost"
                    }
                ]
            });
            res.status(200).json(trades);
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: readByTarget";
            next(err);
        }
    }

    static async createTrade(req, res, next) {
        try {
            const { id: SenderUserId } = req.user;
            const { TargetUserId, SenderPostId, TargetPostId } = req.body;

            if (!TargetUserId || !SenderPostId || !TargetPostId) throw { name: "BadRequest" };

            if (!uuidValidate(SenderUserId)) throw { name: "UserNotFound" };
            if (!uuidValidate(TargetUserId)) throw { name: "UserNotFound" };
            if (!uuidValidate(SenderPostId)) throw { name: "PostNotFound" };
            if (!uuidValidate(TargetPostId)) throw { name: "PostNotFound" };

            const user = await User.findByPk(SenderUserId);
            if (!user) throw { name: "UserNotFound" };
            if (user.status === "suspend") throw { name: "Forbidden" };

            const senderPost = await Post.findByPk(SenderPostId);
            if (!senderPost) throw { name: "PostNotFound" };
            if (senderPost.status === "archive") throw { name: "Forbidden" };
            if (SenderUserId !== senderPost.UserId) throw { name: "Forbidden" };

            const targetPost = await Post.findByPk(TargetPostId);
            if (!targetPost) throw { name: "PostNotFound" };
            if (targetPost.status === "archive") throw { name: "Forbidden" };
            console.log(SenderUserId, SenderPostId, senderPost.UserId, TargetUserId, TargetPostId, targetPost.UserId);
            if (TargetUserId !== targetPost.UserId) throw { name: "Forbidden" };

            const newTrade = await Trade.create({
                SenderUserId,
                TargetUserId,
                SenderPostId,
                TargetPostId
            });
            const [chat, created] = await Chat.findOrCreate({
                where: { SenderId: SenderUserId, ReceiverId: TargetUserId },
                defaults: {
                    SenderId: SenderUserId,
                    ReceiverId: TargetUserId
                }
            });
            console.log("BERHASIL TRADEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEee");
            res.status(201).json({
                message: "Trade successfully created",
                SenderUserId,
                TargetUserId
            });
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: createTrade";
            next(err);
        }
    }

    static async changeStatus(req, res, next) {
        try {
            const { status } = req.body;
            const { id } = req.params;
            if (!status) throw { name: "BadRequest" };
            if (!uuidValidate(id)) throw { name: "TradeNotFound" };

            const findTrade = await Trade.findByPk(id);
            if (!findTrade) throw ({ name: "TradeNotFound" });
            if (findTrade.status === "complete") throw ({ name: "Forbidden" });
            if(status === "complete"){
                const senderPost = await Post.update(
                    {status : "complete"},
                    {where : {id:findTrade.SenderPostId}}
                )
                const targetPost = await Post.update(
                    {status : "complete"},
                    {where : {id:findTrade.TargetPostId}}
                )
            }
            const updatedTrade = await Trade.update(
                {
                    status
                },
                {
                    where: { id },
                }
            );
            res
                .status(200)
                .json({ message: `Successfully updated status Trade with id ${id}` });
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "TradeController: changeStatus";
            next(err);
        }
    }
}

module.exports = TradeController;
