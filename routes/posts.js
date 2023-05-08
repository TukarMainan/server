const { PostController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .post(PostController.create)

router.route("/:id")
    .put(PostController.updatePost)
    .patch(PostController.postUpdateStatus)

router.route("/:id/archive")
    .patch(PostController.postArchive)

module.exports = router;