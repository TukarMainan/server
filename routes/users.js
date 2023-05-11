const { UserController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser, authenticationAdmin, uploadImage } = require("../middlewares");

router.route("/")
    .get(authenticationAdmin, UserController.getAllUser)
    .put(authenticationUser,
        uploadImage.fields([
            { name: "profileImg", maxCount: 1 },
            { name: "backgroundImg", maxCount: 1 },
        ]), UserController.userUpdateProfile)

router.route("/login")
    .post(UserController.login)

// router.route("/login/google")
//     .post(UserController.googleLogin)

router.route("/register")
    .post(UserController.register)

router.route("/update-password")
    .patch(authenticationUser, UserController.updatePassword)

router.route("/:id/suspend")
    .patch(authenticationAdmin, UserController.userSuspend)

module.exports = router;