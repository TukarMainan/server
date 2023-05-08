const { UserController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser, authenticationAdmin, authorizeUser } = require("../middlewares");

router.route("/")
    .get(authenticationAdmin, UserController.getAllUser)

router.route("/login")
    .post(UserController.login)

// router.route("/login/google")
//     .post(UserController.googleLogin)

router.route("/register")
    .post(UserController.register)

// router.route("/update-password")
//     .patch(UserController.updatePassword)

router.route("/:id/suspend")
    .patch(authenticationAdmin, UserController.userSuspend)

router.route("/:id")
    .put(authenticationUser, authorizeUser, UserController.userUpdateProfile)

module.exports = router;