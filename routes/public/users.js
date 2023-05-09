const { UserController } = require("../../controllers");
const router = require("express").Router();

router.route("/verify/:id")
    .get(UserController.verifyEmail)

router.route("/:id")
    .get(UserController.getUserById)

module.exports = router;