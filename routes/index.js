const router = require("express").Router();

const publicRouter = require("./public");
const adminLogsRouter = require("./adminlogs");
const adminsRouter = require("./admins");
const categoriesRouter = require("./categories");
const chatsRouter = require("./chats");
const commentsRouter = require("./comments");
const messagesRouter = require("./messages");
const notificationsRouter = require("./notifications");
const postsRouter = require("./posts");
const reportsRouter = require("./reports");
const usersRouter = require("./users");

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

module.exports = router;