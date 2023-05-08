const {Report,User,Post } = require("../models");


class ReportController {
  static async readAll(req,res,next){
    try {
      const reports = await Report.findAll({
        include:[User,Post]
      });
      res.status(200).json(reports);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "ReportController: readAll";
      next(err);
    }
  }
}

module.exports = ReportController;