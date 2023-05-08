const { ReportController } = require("../controllers");
const router = require("express").Router();

const { authenticationUser, authenticationAdmin } = require("../middlewares");

router.route("/")
    .get(authenticationAdmin, ReportController.getReports)
    .post(authenticationUser, ReportController.create)

module.exports = router;