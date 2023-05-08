// const { CategoryController } = require("../../controllers");
const CategoryController = require("../../controllers/CategoryController");
const router = require("express").Router();

router.route("/").get(CategoryController.readAll);

router.route("/:id").get(CategoryController.readById);

module.exports = router;
