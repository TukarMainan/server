const { Op } = require("sequelize");
const { Post, User, Category } = require("../models");
const { Sequelize } = require("sequelize");
const { validate: uuidValidate } = require('uuid');

class PostController {
  static async getPosts(req, res, next) {
    try {
      const { CategoryId, sortby, search, city } = req.query
      const options = {
        order: [],
        where: {}
      }
      if (CategoryId) {
        options.where = {
          ...options.where,
          CategoryId
        }
        if (sortby) {
          options.order = [['createdAt', sortby]]
        }
      }
      if (search) {
        options.where = {
          ...options.where,
          title: { [Op.iLike]: `%${search}%` }
        }
      }
      if (city) {
        options.where = {
          ...options.where,
          city
        }
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

  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const postById = await Post.findByPk(id, {
        include: [User, Category]
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
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const findPost = await Post.findByPk(id);
      if (!findPost) throw ({ name: "PostNotFound" });
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
        user.status = "suspend"
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

  static async updatePost(req, res, next) {
    try {
      const { title, description, condition, CategoryId, meetingPoint, images, price } = req.body;
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "PostNotFound" };
      const foundPost = await Post.findByPk(id);
      if (!foundPost) throw ({ name: "PostNotFound" });
      const updatedPost = await Post.update(
        {
          title,
          description,
          condition,
          CategoryId,
          meetingPoint: Sequelize.fn(
            'ST_GeomFromText',
            Sequelize.literal(`'POINT(${meetingPoint.longitude} ${meetingPoint.latitude})'`),
            '4326'
          ),
          images,
          price
        },
        {
          where: { id },
        }
      );
      res
        .status(200)
        .json({ message: `Successfully updated post` });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "PostController: updatePost";
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { title, description, condition, CategoryId, meetingPoint, images, price } = req.body;

      const newPost = await Post.create(
        {
          title,
          UserId,
          description,
          condition,
          CategoryId,
          status: "active",
          meetingPoint: Sequelize.fn(
            'ST_GeomFromText',
            Sequelize.literal(`'POINT(${meetingPoint.longitude} ${meetingPoint.latitude})'`),
            '4326'
          ),
          images,
          price
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
}

module.exports = PostController;