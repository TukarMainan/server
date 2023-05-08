const { Report, User, Post } = require("../models");

class ReportController {
    static async getReports(req, res, next) {
        try {
            const reports = await Report.findAll({
                include: [User, Post],
            });
            res.status(200).json(reports);
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "ReportController: getReports";
            next(err);
        }
    }

    static async create(req, res, next) {
        try {
            const { UserId, PostId, message } = req.body;

            const newReports = await Report.create({
                UserId,
                PostId,
                message
            });
            res.status(200).json({ message: "Report successfully created" });
        } catch (err) {
            err.ERROR_FROM_CONTROLLER = "ReportController: create";
            next(err);
        }
    }
}

module.exports = ReportController;