const { PostController } = require("../controllers");
const { uploadImage } = require("../middlewares");
const router = require("express").Router();

const { authenticationUser, authorizeUserPost, authenticationAdmin } = require("../middlewares");

router.route("/")
    .post(authenticationUser, uploadImage.array('images', 5), PostController.create)

router.route("/posts-by-average-profile-price")
    .get(authenticationUser, PostController.recommendPostBasedOnProfileItemPrice)

router.route("/:id/archive")
    .patch(authenticationAdmin, PostController.postArchive)

router.route("/:id")
    // .put(authenticationUser, authorizeUserPost, PostController.updatePost)
    .patch(authenticationUser, authorizeUserPost, PostController.postUpdateStatus)

module.exports = router;