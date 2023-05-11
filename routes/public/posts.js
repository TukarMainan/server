const { PostController } = require("../../controllers");
const { authenticationUser } = require("../../middlewares");
const router = require("express").Router();

router.route("/")
    .get(PostController.getPosts)

router.route("/nearby")
    .get(authenticationUser,PostController.nearbyPost)

router.route("/:id")
    .get(PostController.getPostById)


module.exports = router;