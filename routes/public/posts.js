const { PostController } = require("../../controllers");
const router = require("express").Router();

router.route("/")
    .get(PostController.getPosts)

router.route("/nearby")
    .get(PostController.nearbyPost)

router.route("/:id")
    .get(PostController.getPostById)


module.exports = router;