const { ChatController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser } = require("../middlewares");

router.route("/")
    .get(authenticationUser, ChatController.readAllByUserId)
    .post(authenticationUser, ChatController.createByUserId)

module.exports = router;