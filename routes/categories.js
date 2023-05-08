// const { CategoryController } = require("../controllers");
const CategoryController = require("../controllers/CategoryController");
const router = require("express").Router();

router.route("/").post(CategoryController.create);

router.route("/:id").patch(CategoryController.updateName);

module.exports = router;
