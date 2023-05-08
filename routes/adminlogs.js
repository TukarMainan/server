const { AdminController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .get(AdminController.getAdminLogs)

module.exports = router;