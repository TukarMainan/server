const { Op } = require("sequelize");
const { Post, User, Category, Comment, Review } = require("../models");
const { Sequelize } = require("sequelize");
const { validate: uuidValidate } = require('uuid');
const { imagekit } = require("../middlewares/imageUploadHandler");
const fs = require('fs');
const fse = require('fs-extra');

class PostController {
  static async getPosts(req, res, next) {
    try {
      const { CategoryId, sortby, search, city, condition } = req.query;
      const options = {
        where: {},
        include: [
          {
            model: User,
            where: {},
            attributes: {
              exclude: ["password"]
            }
          },
          {
            model: Category
          }
        ],
        order: []
      }
      if (sortby) {
        options.order = [['createdAt', sortby]]
      }
      if (CategoryId) {
        options.where = {
          ...options.where,
          CategoryId
        }
      }
      if (condition) {
        options.where = {
          ...options.where,
          condition
        }
      }
      if (search) {
        options.where = {
          ...options.where,
          title: { [Op.iLike]: `%${search}%` }
        }
      }
      if (city) {
        options.include[0].where = { city }
      }
      const posts = await Post.findAll(options);
      res.status(200).json(posts);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: getPosts";
      next(err);
    }
  }

  static async nearbyPost(req, res, next) {
    try {
      const { location } = req.headers;
      if (!location) throw { name: "BadRequest" };

      const { latitude, longitude } = JSON.parse(location);
      if (!latitude || !longitude) throw { name: "BadRequest" };

      const userLocation = Sequelize.literal(`ST_GeomFromText('POINT(${longitude} ${latitude})')`);

      const posts = await Post.findAll({
        where: Sequelize.where(
          Sequelize.fn(
            'ST_DistanceSphere',
            Sequelize.col('meetingPoint'),
            userLocation,
          ),
          {
            [Op.lte]: 5000
          },
          {
            status: "active"
          }
        ),
        order: [
          [Sequelize.fn(
            'ST_DistanceSphere',
            Sequelize.col('meetingPoint'),
            userLocation,
          ), 'ASC'],
        ],
        limit: 10
      });

      res.status(200).json(posts);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: nearbyPost";
      next(err);
    }
  }

  static async recommendPostBasedOnProfileItemPrice(req, res, next) {
    try {
      const { id: UserId } = req.user;

      const posts = await Post.findAll({
        where: { UserId }
      });

      const validPrices = posts.map(el => {
        if (el.price !== null) return el.price;
      })
      if (!validPrices.length) throw { name: "PostNotFound" };

      const sum = validPrices.reduce((acc, val) => acc + val, 0);
      const average = sum / validPrices.length;

      const recommendedPost = await Post.findAll({
        where: {
          price: {
            [Op.and]: {
              [Op.between]: [average - 100000, average + 100000]
            }
          },
          status: "active"
        }
      });

      res.status(200).json(recommendedPost);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: recommendPostBasedOnProfileItemPrice";
      next(err);
    }
  }

  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const postById = await Post.findByPk(id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"]
            },
            include: {
              model: Review,
              as: "UserReviews",
              include: {
                model: User,
                as: "SenderReviewer",
                attributes: {
                  exclude: ["password"]
                }
              }
            }
          },
          {
            model: Category
          },
          {
            model: Comment,
            include: {
              model: User,
              attributes: {
                exclude: ["password"]
              },
              include: {
                model: Review,
                as: "UserReviews",
                include: {
                  model: User,
                  as: "SenderReviewer",
                  attributes: {
                    exclude: ["password"]
                  }
                }
              }
            }
          }
        ]
      });
      if (!postById) throw ({ name: "PostNotFound" });
      res.status(200).json(postById);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: getPostById";
      next(err);
    }
  }

  static async postUpdateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;
      if (!status) throw { name: "BadRequest" };
      if (!uuidValidate(id)) throw { name: "PostNotFound" };

      const findPost = await Post.findByPk(id);
      if (!findPost) throw ({ name: "PostNotFound" });

      // if (findPost.status === "archived") throw { name: "Forbidden" };

      const updatedPost = await Post.update(
        {
          status
        },
        {
          where: { id },
        }
      );
      res
        .status(200)
        .json({ message: `Successfully updated status Post with id ${id}` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: postUpdateStatus";
      next(err);
    }
  }

  static async postArchive(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const post = await Post.findByPk(id);
      if (!post) throw { name: "PostNotFound" };
      const user = await User.findByPk(post.UserId);

      user.warningCount = user.warningCount + 1;
      if (user.warningCount > 5) {
        user.status = "suspend";
        await Post.update(
          {
            status: "archived"
          },
          {
            where: { UserId: user.id }
          }
        )
      }
      await user.save();

      await Post.update({ status: 'archived' }, { where: { id: post.id } });

      res
        .status(200)
        .json({ message: `Successfully archive Post with id ${id}` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: postArchive";
      next(err);
    }
  }

  // INACTIVE
  // static async updatePost(req, res, next) {
  //   try {
  //     throw { name: "ISE" };
  //     const { title, description, condition, CategoryId, meetingPoint, images, price } = req.body;
  //     const { id } = req.params;

  //     if (!uuidValidate(id)) throw { name: "PostNotFound" };
  //     if (!uuidValidate(CategoryId)) throw { name: "CategoryNotFound" };
  //     const category = await Category.findByPk(CategoryId);
  //     if (!category) throw { name: "CategoryNotFound" };

  //     const foundPost = await Post.findByPk(id);
  //     if (!foundPost) throw ({ name: "PostNotFound" });

  //     const { longitude, latitude } = JSON.parse(meetingPoint);
  //     const updatedPost = await Post.update(
  //       {
  //         title,
  //         description,
  //         condition,
  //         CategoryId,
  //         meetingPoint: longitude && latitude ? Sequelize.fn(
  //           'ST_GeomFromText',
  //           Sequelize.literal(`'POINT(${longitude} ${latitude})'`),
  //           '4326'
  //         ) : null,
  //         images: JSON.parse(images),
  //         price: price || null
  //       },
  //       {
  //         where: { id },
  //       }
  //     );
  //     res
  //       .status(200)
  //       .json({ message: `Successfully updated post` });
  //   } catch (err) {
  //     err.ERROR_FROM_CONTROLLER = "PostController: updatePost";
  //     next(err);
  //   }
  // }

  static async create(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { title, description, condition, CategoryId, meetingPoint, price } = req.body;

      if (!uuidValidate(CategoryId)) throw { name: "CategoryNotFound" };
      const category = await Category.findByPk(CategoryId);
      if (!category) throw { name: "CategoryNotFound" };

      const files = req.files;
      const images = [];

      for (const file of files) {
        const readStream = fs.createReadStream(file.path);
        const imageName = file.filename;

        const result = await imagekit.upload({
          file: readStream,
          fileName: imageName
        })
        images.push(result.url);
        fse.removeSync(file.path);
      }

      const { longitude, latitude } = JSON.parse(meetingPoint);

      const newPost = await Post.create(
        {
          title,
          UserId,
          description,
          condition,
          CategoryId,
          status: "active",
          meetingPoint: longitude && latitude ? Sequelize.fn(
            'ST_GeomFromText',
            Sequelize.literal(`'POINT(${longitude} ${latitude})'`),
            '4326'
          ) : null,
          images,
          price: price || null
        }
      );

      res
        .status(201)
        .json({ message: `Successfully create post` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: create";
      next(err);
    }
  }
  static async deletePost(req,res,next){
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const deletedPost = await Post.destroy({
        where:id
      })
      res
        .status(201)
        .json({ message: `Successfully delete post` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: detelePost";
      next(err);
    }
  }
}

module.exports = PostController;