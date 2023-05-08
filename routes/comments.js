const { CommentController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser } = require("../middlewares");

router.route("/").post(authenticationUser, CommentController.createByUserId);

module.exports = router;
