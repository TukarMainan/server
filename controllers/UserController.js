const { Op } = require("sequelize");
const { User, Review, Post, Category } = require("../models");
const { verifyPassword, signToken, hashPassword } = require("../helpers");
const { validate: uuidValidate } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const axios = require("axios");
const crypto = require('crypto');
const api_key = process.env.APIKEY_EMAIL_VALIDATION_ABSTRACTAPI;
const ourEmail = process.env.NODEMAILER_EMAIL;
const ourEmailPassword = process.env.NODEMAILER_EMAIL_PASSWORD;
const fs = require('fs');
const fse = require('fs-extra');
const { imagekit } = require("../middlewares");

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, city } = req.body;

      const isValid = await axios({
        url: `https://emailvalidation.abstractapi.com/v1/?api_key=${api_key}&email=${email}`,
        method: "GET",
      });

      if (isValid.data.deliverability != "DELIVERABLE") {
        throw { name: "InactiveEmail" };
      }

      const token = crypto.randomBytes(32).toString('hex');
      console.log(token);
      const newUser = await User.create({
        username,
        email,
        password,
        city,
        token
      });

      const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: ourEmail,
          pass: ourEmailPassword
        }
      });

      const mailOptions = {
        from: ourEmail,
        to: email,
        subject: 'Verifikasi Alamat Email - TukarMainan',
        html: `
<h1>
Salam ${username},
</h1>
</br>
<p>
Terima kasih telah mendaftar dalam aplikasi TukarMainan! Kami senang memiliki Anda sebagai pelanggan dan berharap dapat menyediakan pilihan mainan anak terbaik yang tersedia di pasaran.

Untuk memastikan bahwa akun Anda aman dan kami dapat berkomunikasi dengan efektif, kami memerlukan semua pelanggan untuk memverifikasi alamat email mereka. Silakan klik tautan di bawah ini untuk memverifikasi alamat email Anda dan menyelesaikan proses pendaftaran:
</p>
</br>
<a href="http://localhost:3000/public/users/verify/${newUser.id}?token=${newUser.token}">Klik di sini untuk memverifikasi email</a>
</br>
<p>
Setelah Anda memverifikasi email, Anda akan dapat mengakses semua fitur aplikasi TukarMainan.

Jika Anda memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi kami melalui tukarmainan@outlook.com.
</p>
</br>
<p>
Terima kasih telah memilih TukarMainan!
</br>
Salam hormat,
</br>
</br>
<strong>TukarMainan</strong>
</p>
`};

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw { name: "NodeMailerError" };
        } else {
          console.log('Email sent: ' + info.response);
        }
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
            as: "UserReviews",
            include: [
              {
                model: User,
                as: "SenderReviewer",
                attributes: {
                  exclude: ["password"]
                }
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

  static async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;
      const { id } = req.params;
      if (!token || !id) throw { name: "BadRequest" };
      if (!uuidValidate(id)) throw { name: "UserNotFound" };
      const user = await User.findByPk(id);
      if (!user) throw ({ name: "UserNotFound" });
      if (user.token !== token) throw { name: "Unauthorized" };

      user.status = "verified";
      await user.save();

      res
        .status(200)
        .json({ message: `Successfully verified User with id ${id}` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "UserController: verifyEmail";
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
      const { name, notes, phoneNumber, city } = req.body;
      if (!city) throw { name: "BadRequest" };

      const { id } = req.user;
      const findUser = await User.findByPk(id);
      if (!findUser) throw ({ name: "UserNotFound" });

      const files = req.files;
      const profileImg = files.profileImg[0];
      const backgroundImg = files.backgroundImg[0];

      let profileImgUrl = null;
      let backgroundImgUrl = null;

      if (profileImg) {
        const profileImgReadStream = fs.createReadStream(profileImg.path);
        const profileImgFileName = profileImg.filename;

        const resultProfileImg = await imagekit.upload({
          file: profileImgReadStream,
          fileName: profileImgFileName
        })
        profileImgUrl = resultProfileImg.url;
        fse.removeSync(profileImg.path);
      }

      if (backgroundImg) {
        const backgroundImgReadStream = fs.createReadStream(backgroundImg.path);
        const backgroundImgFileName = backgroundImg.filename;

        const resultBackgroundImg = await imagekit.upload({
          file: backgroundImgReadStream,
          fileName: backgroundImgFileName
        })
        backgroundImgUrl = resultBackgroundImg.url;
        fse.removeSync(backgroundImg.path);
      }

      const updatedUser = await User.update(
        {
          name: name || null,
          profileImg: profileImgUrl || null,
          backgroundImg: backgroundImgUrl || null,
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
      const { oldpassword, newpassword } = req.body;

      if (!oldpassword || !newpassword) throw { name: "BadRequest" };

      const user = await User.findByPk(id);

      if (!user) throw { name: "Unauthorized" };

      const isValid = await verifyPassword(user.password, oldpassword);
      if (!isValid) throw { name: "Unauthorized" };

      const hashedNewPassword = await hashPassword(newpassword);
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