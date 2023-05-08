const { UserController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .get(UserController.getAllUser)

router.route("/login")
    .post(UserController.login)

// router.route("/login/google")
//     .post(UserController.googleLogin)

router.route("/register")
    .post(UserController.register)

// router.route("/update-password")
//     .patch(UserController.updatePassword)

router.route("/:id/suspend")
    .patch(UserController.userSuspend)

router.route("/:id")
    .put(UserController.userUpdateProfile)
    .patch(UserController.userUpdateStatus)

module.exports = router;