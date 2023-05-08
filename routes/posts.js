const { PostController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .post(PostController.create)

router.route("/:id/archive")
    .patch(PostController.postArchive)

router.route("/:id")
    .put(PostController.updatePost)
    .patch(PostController.postUpdateStatus)

module.exports = router;