const { Op } = require("sequelize");
const { User, Review, Post, Category } = require("../models");
const { verifyPassword, signToken, hashPassword } = require("../helpers");
const { validate: uuidValidate } = require('uuid');
const { OAuth2Client } = require('google-auth-library');

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
      if (user.status == "suspend") throw { name: "UserSuspended" };

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

      res.status(200).json({ access_token, id: user.id, username: user.username, email: user.email });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: login";
      next(err);
    }

  }
  static async getAllUser(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ["id", "status", "city"]
      });
      res.status(200).json(users);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: getAllUser";
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "UserNotFound" };
      const userById = await User.findByPk(id, {
        where: {
          status: {
            [Op.ne]: 'suspend'
          }
        },
        attributes: {
          exclude: ["password"]
        },
        include: [
          {
            model: Review,
            include: [
              {
                model: User,
                as: "SenderReview"
              },
              {
                model: Post
              }
            ]
          },
          {
            model: Post,
            include: Category
          },
        ]
      });
      if (!userById) throw ({ name: "UserNotFound" });
      res.status(200).json(userById);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: getUserById";
      next(err);
    }
  }

  static async userUpdateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "UserNotFound" };
      const findUser = await User.findByPk(id);
      if (!findUser) throw ({ name: "UserNotFound" });
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

  static async userSuspend(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "UserNotFound" };
      const user = await User.findByPk(id);
      if (!user) throw { name: "UserNotFound" };

      user.status = "suspend";
      await user.save();

      await Post.update(
        {
          status: "archived"
        },
        {
          where: { UserId: id }
        }
      )

      res
        .status(200)
        .json({ message: `Successfully suspend User with id ${id}` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: userSuspend";
      next(err);
    }
  }

  static async userUpdateProfile(req, res, next) {
    try {
      const { name, profileImg, backgroundImg, notes, phoneNumber, city } = req.body;
      if (!city) throw { name: "BadRequest" };

      const { id } = req.user;
      const findUser = await User.findByPk(id);
      if (!findUser) throw ({ name: "UserNotFound" });

      const updatedUser = await User.update(
        {
          name: name || null,
          profileImg: profileImg || null,
          backgroundImg: backgroundImg || null,
          notes: notes || null,
          phoneNumber: phoneNumber || null,
          city
        },
        {
          where: { id },
        }
      );
      res
        .status(200)
        .json({ message: `Successfully updated profile` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: userUpdateProfile";
      next(err);
    }
  }

  static async updatePassword(req, res, next) {
    try {

      const { id } = req.user;
      const { oldPassword, NewPassword } = req.body;

      if (!oldPassword || !NewPassword) throw { name: "BadRequest" };

      const user = await User.findByPk(id);

      if (!user) throw { name: "Unauthorized" };

      const isValid = await verifyPassword(user.password, oldPassword);
      if (!isValid) throw { name: "Unauthorized" };

      const hashedNewPassword = await hashPassword(NewPassword);
      const updatedUser = await User.update(
        {
          password: hashedNewPassword
        },
        {
          where: { id },
        }
      );

      res.status(200)
        .json({ message: `Successfully updated Password` })
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: updatePassword";
      next(err);
    }

  }

  static async googleLogin(req, res, next) {
    // console.log(req.headers)
    const googleToken = req.headers.google_access_token
    // console.log(googleToken)

    const client = new OAuth2Client(process.env.CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email } = payload
    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        username: name,
        email: email,
        password: "default",
        city: "Jakarta"
      },
      hooks: false,
    })
    const access_token = signToken({ id: newUser.id })
    res.status(created ? 201 : 200).json({
      access_token,
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    })
  }
}

module.exports = UserController;