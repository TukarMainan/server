const { hashPassword, verifyPassword } = require("./argon2");
const { signToken, verifyToken } = require("./jwt");

module.exports = {
    hashPassword,
    verifyPassword,
    signToken,
    verifyToken,
}