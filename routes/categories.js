const { CategoryController } = require("../controllers");
const router = require("express").Router();

router.route("/").post(CategoryController.create);

router.route("/:id").patch(CategoryController.updateName);

module.exports = router;
