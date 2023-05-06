const { Op } = require("sequelize");
const { User } = require("../models");
const { verifyPassword, signToken } = require("../helpers");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, city } = req.body;

      // NotNull and NotEmpty already handled by SequelizeValidationError
      // if (!email) return next({ name: "EmailRequired" });
      // if (!password) return next({ name: "PasswordRequired" });
      // if (!name) return next({ name: "NameRequired" });
      // if (!city) return next({ name: "CityRequired" });
      const newUser = await User.create({
        username,
        email,
        password,
        city
      });

      res.status(201).json({ message: "Success creating new user" });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: register";
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      // Key username value can be < username > || < email >
      const { username, password } = req.body;

      // Handle both validation in one error name
      // if (!email) return next({ name: "EmailRequired" });
      // if (!password) return next({ name: "PasswordRequired" });
      if (!username || !password) throw { name: "BadRequest" };

      // Login with username or email, client send as key username
      const searchOptions = {
        where: {
          [Op.or]: [
            { username: username },
            { email: username }
          ]
        }
      }

      const user = await User.findOne(searchOptions);

      if (!user) throw { name: "Unauthorized" };

      // Argon2 can only use promise, must await
      const isValid = await verifyPassword(user.password, password);
      if (!isValid) throw { name: "Unauthorized" };
      // if (!verifyPassword(password, user.password)) {
      //   next({ name: "UserNotFound" });
      // }

      // Access token payload with only id is enough
      const access_token = signToken({
        id: user.id
      });

      res.status(200).json({ access_token });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: login";
      next(err);
    }

  }
  static async getAllUser(req,res,next){
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: getAllUser";
      next(err);
    }
  }
  
  static async getUserById(req,res,next){
    try {
      const { id } = req.params;
      const userById = await User.findByPk(id);
      if (!userById) throw ({ name: "UserNotFound" });
      res.status(200).json(userById);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: getUserById";
      next(err);
    }
  }

  static async userUpdateStatus(req,res,next){
    try {
      const { status } = req.body;
      const { id } = req.params;
      const findUser = await User.findByPk(id);
      if (!findUser) throw({ name: "UserNotFound" });
      const updatedUser = await User.update(
        {
          status
        },
        {
          where: { id },
        }
      );
      res
        .status(200)
        .json({ message: `Successfully updated status User with id ${id}` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: userUpdateStatus";
      next(err);
    }
  }
}

module.exports = UserController;