const { Admin, AdminLog } = require("../models");

class AdminLogController {

  static async readAll(req, res, next) {
    try {
      const logs = await AdminLog.findAll({
        include: {
          model: Admin,
          attributes: {
            exclude: ["password"]
          }
        }
      });
      res.status(200).json(logs);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "AdminLogController: readAll";
      next(err);
    }
  }
}

module.exports = AdminLogController;