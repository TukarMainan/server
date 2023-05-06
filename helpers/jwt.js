const { sign, verify } = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY_JWT;

const signToken = (payload) => sign(payload, SECRET_KEY);
const verifyToken = (token) => verify(token, SECRET_KEY);

module.exports = {
    signToken,
    verifyToken,
}