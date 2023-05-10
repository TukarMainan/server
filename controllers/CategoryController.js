const { Category } = require("../models");
const { validate: uuidValidate } = require('uuid');

class CategoryController {
  static async readAll(req, res, next) {
    try {
      const categories = await Category.findAll();

      res.status(200).json(categories);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "CategoryController: readAll";
      next(err);
    }
  }

  static async readById(req, res, next) {
    try {
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "CategoryNotFound" };

      const category = await Category.findByPk(id);
      if (!category) throw { name: "CategoryNotFound" };

      res.status(200).json(category);
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "CategoryController: readById";
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name } = req.body;

      const category = {
        name,
      };
      if (!name) throw { name: "BadRequest" };

      await Category.create(category);

      res.status(201).json({ message: "Success creating new category" });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "CategoryController: create";
      next(err);
    }
  }

  static async updateName(req, res, next) {
    try {
      const { name } = req.body;
      const { id } = req.params;
      if (!uuidValidate(id)) throw { name: "CategoryNotFound" };
      if (!name) throw { name: "BadRequest" };


      await Category.update(
        { name },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({ message: " Success updating category name" });
    } catch (err) {
      err.ERROR_FROM_CONTROLLER = "CategoryController: updateName";
      next(err);
    }
  }
}

module.exports = CategoryController;
