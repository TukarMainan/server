const { NotificationController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .get(NotificationController.readAllByUserId)

module.exports = router;
