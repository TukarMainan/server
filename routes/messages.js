// const { MessageController } = require("../controllers");
const MessageController = require("../controllers/MessageController");
const router = require("express").Router();

router.route("/").get(MessageController.readAllByUserId);
//     .post(MessageController.createByUserId)

module.exports = router;
