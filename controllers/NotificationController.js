const { Notification } = require("../models");

class NotificationController {
  static async readAllByUserId(req, res, next) {
    try {
      const { id } = req.user;
      const notifications = await Notification.findAll({ where: { UserId: id } });
console.log(notifications);
      res.status(200).json(notifications);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "NotificationController: readAllByUserId";
      next(err);
    }
  }
}

module.exports = NotificationController;
