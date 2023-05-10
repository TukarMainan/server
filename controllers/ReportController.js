const { Report, User, Post } = require("../models");
const { validate: uuidValidate } = require('uuid');

class ReportController {
    static async getReports(req, res, next) {
        try {
            const reports = await Report.findAll({
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ["password"]
                        }
                    },
                    {
                        model: Post
                    }],
            });
            res.status(200).json(reports);
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "ReportController: getReports";
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { id: UserId } = req.user;
            const { PostId, message } = req.body;

            if (!uuidValidate(PostId)) throw { name: "PostNotFound" };
            const post = await Post.findByPk(PostId);
            if (!post) throw { name: "PostNotFound" };

            const newReports = await Report.create({
                UserId,
                PostId,
                message
            });
            res.status(201).json({ message: "Report successfully created" });
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "ReportController: create";
            next(err);
        }
    }
}

module.exports = ReportController;