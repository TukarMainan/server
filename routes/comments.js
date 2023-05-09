const { CommentController } = require("../controllers");

const router = require("express").Router();

router.route("/").post(CommentController.createByUserId);

module.exports = router;
