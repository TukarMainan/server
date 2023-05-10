const { TradeController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser } = require("../middlewares");

router.route("/")
    .post(authenticationUser, TradeController.createTrade)

router.route("/sender")
    .get(authenticationUser, TradeController.readBySender)

router.route("/target")
    .get(authenticationUser, TradeController.readByTarget)

router.route("/:id")
    .patch(authenticationUser, TradeController.changeStatus)

module.exports = router;