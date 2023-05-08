const { Op } = require("sequelize");
const { Admin } = require("../models");
const { verifyPassword, signToken } = require("../helpers");

class AdminController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      // NotNull and NotEmpty already handled by SequelizeValidationError

      const newAdmin = await Admin.create({
        username,
        email,
        password
      });

      res.status(201).json({ message: "Success creating new admin" });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "AdminController: register";
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      // Key username value can be < username > || < email >
      const { username, password } = req.body;

      // Handle both validation in one error name
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

      const admin = await Admin.findOne(searchOptions);
      if (!admin) throw { name: "Unauthorized" };

      // Argon2 can only use promise, must await
      const isValid = await verifyPassword(admin.password, password);
      if (!isValid) throw { name: "Unauthorized" };

      // Access token payload with only id is enough
      const access_token = signToken({
        id: admin.id
      });

      res.status(200).json({ access_token, id: admin.id, username: admin.username, email: admin.email });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "AdminController: login";
      next(err);
    }
  }
}

module.exports = AdminController;