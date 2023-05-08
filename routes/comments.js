// const { CommentController } = require("../controllers");
const CommentController = require("../controllers/CommentController");
const router = require("express").Router();

router.route("/").post(CommentController.createByUserId);

module.exports = router;
