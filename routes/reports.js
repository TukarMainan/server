const { ReportController } = require("../controllers");
const router = require("express").Router();

router.route("/")
    .get(ReportController.getReports)
    .post(ReportController.create)

module.exports = router;