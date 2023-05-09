const { ReviewController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser } = require("../middlewares");

router.route("/")
    .post(authenticationUser, ReviewController.create)

module.exports = router;
