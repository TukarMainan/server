const { User } = require("../models");
const { verifyPassword } = require("../helpers/argon2");
const { signToken } = require("../helpers/jwt");

class UserController {
  static async registerAdmin(req, res, next) {
    try {
      const { username,email,password,name,city} = req.body;
      if (!email) return next({ name: "EmailRequired" });
      if (!password) return next({ name: "PasswordRequired" });
      if (!name) return next({ name: "NameRequired" });
      if (!city) return next({ name: "CityRequired" });
      const newUser = await User.create({
        email,
        password,
        name,
        city
      });
      res.status(201).json({ message: "Success creating new user" });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) return next({ name: "EmailRequired" });
      if (!password) return next({ name: "PasswordRequired" });
      const user = await User.findOne({
        where: { email },
      });
      if (!user) next({ name: "UserNotFound" });
      if (!verifyPassword(password, user.password)) {
        next({ name: "UserNotFound" });
      }
      const token = signToken({
        id: user.id,
        email: user.email,
      });
      res.status(200).json({ access_token: token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = UserController;