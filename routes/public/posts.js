const { PostController } = require("../../controllers");
const router = require("express").Router();

router.route("/")
    .get(PostController.getPosts)

router.route("/:id")
    .get(PostController.getPostById)

// router.route("/recommendations")
//     .get(PostController.recommendations)

module.exports = router;