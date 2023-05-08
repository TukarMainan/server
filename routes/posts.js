const { PostController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser, authorizeUserPost, authenticationAdmin } = require("../middlewares");

router.route("/")
    .post(authenticationUser, PostController.create)

router.route("/posts-by-average-profile-price")
    .get(authenticationUser, PostController.recommendPostBasedOnProfileItemPrice)

router.route("/:id/archive")
    .patch(authenticationAdmin, PostController.postArchive)

router.route("/:id")
    .put(authenticationUser, authorizeUserPost, PostController.updatePost)
    .patch(authenticationUser, authorizeUserPost, PostController.postUpdateStatus)

module.exports = router;