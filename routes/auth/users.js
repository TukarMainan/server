const { UserController } = require("../../controllers");
const router = require("express").Router();

router.route("/login")
    .post(UserController.login)

router.route("/register")
    .post(UserController.register)

// router.route("/update-password")
//     .patch(UserController.updatePassword)

module.exports = router;