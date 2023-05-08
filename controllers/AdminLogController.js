const { Admin,AdminLog,} = require("../models");

class AdminLogController {
  
    static async readAll(req,res,next){
    try {
      const logs = await AdminLog.findAll({
        include:[Admin]
      });
      res.status(200).json(logs);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "AdminLogController: readAll";
      next(err);
    }
  }
}

module.exports = AdminLogController;