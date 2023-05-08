const { CategoryController } = require("../controllers");
const router = require("express").Router();

const { authenticationAdmin } = require("../middlewares");

router.route("/").post(authenticationAdmin, CategoryController.create);

router.route("/:id").patch(authenticationAdmin, CategoryController.updateName);

module.exports = router;
