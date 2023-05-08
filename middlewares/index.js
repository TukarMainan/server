module.exports = {
    errorHandler: require("./errorHandler"),
    authenticationAdmin: require("./authHandler").authenticationAdmin,
    authenticationUser: require("./authHandler").authenticationUser,
    authorizeUserPost: require("./authHandler").authorizeUserPost,
}