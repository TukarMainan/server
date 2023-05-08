const router = require("express").Router();

const publicUsersRouter = require("./users");
const publicPostsRouter = require("./posts");
const publicCategoriesRouter = require("./categories");

router.use("/users", publicUsersRouter);
router.use("/posts", publicPostsRouter);
router.use("/categories", publicCategoriesRouter);

module.exports = router;