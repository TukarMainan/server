const { hash, verify } = require("argon2");

const hashPassword = (password) => hash(password);
const verifyPassword = (hashedPassword, password) => verify(hashedPassword, password);

module.exports = {
    hashPassword,
    verifyPassword,
}