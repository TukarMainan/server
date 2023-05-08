const { AdminLogController } = require("../controllers");
const router = require("express").Router();

const { authenticationAdmin } = require("../middlewares");

router.route("/")
    .get(authenticationAdmin, AdminLogController.readAll)

module.exports = router;