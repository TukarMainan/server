const router = require("express").Router();

const authUsersRouter = require("./users");
const authAdminsRouter = require("./admins");

router.use("/users", authUsersRouter);
router.use("/admins", authAdminsRouter);

module.exports = router;