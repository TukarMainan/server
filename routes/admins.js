const { AdminController } = require("../controllers");
const router = require("express").Router();

const { authenticationAdmin } = require("../middlewares");

router.route("/login")
    .post(AdminController.login)

router.route("/register")
    .post(authenticationAdmin, AdminController.register)

router.route("/update-password")
    .patch(AdminController.updatePassword)

module.exports = router;