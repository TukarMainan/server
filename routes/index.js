const router = require("express").Router();

const publicRouter = require("./public");
const adminLogsRouter = require("./adminlogs");
const adminsRouter = require("./admins");
const categoriesRouter = require("./categories");
const chatsRouter = require("./chats");
const commentsRouter = require("./comments");
const notificationsRouter = require("./notifications");
const postsRouter = require("./posts");
const reportsRouter = require("./reports");
const usersRouter = require("./users");
const reviewsRouter = require("./reviews");
const tradesRouter = require ("./trades")

router.use("/public", publicRouter);
router.use("/adminlogs", adminLogsRouter);
router.use("/admins", adminsRouter);
router.use("/categories", categoriesRouter);
router.use("/chats", chatsRouter);
router.use("/comments", commentsRouter);
router.use("/notifications", notificationsRouter);
router.use("/posts", postsRouter);
router.use("/reports", reportsRouter);
router.use("/users", usersRouter);
router.use("/reviews", reviewsRouter);
router.use("/trades", tradesRouter);

module.exports = router;