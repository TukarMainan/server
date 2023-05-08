const { UserController } = require("../../controllers");
const router = require("express").Router();

router.route("/:id")
    .get(UserController.getUserById)

module.exports = router;