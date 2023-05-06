const { AdminController } = require("../../controllers");
const router = require("express").Router();

router.route("/login")
    .post(AdminController.login)

router.route("/register")
    .post(AdminController.register)

// router.route("/update-password")
//     .patch(AdminController.updatePassword)

module.exports = router;