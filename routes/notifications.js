const { NotificationController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser } = require("../middlewares");

router.route("/")
    .get(authenticationUser, NotificationController.readAllByUserId)

module.exports = router;
