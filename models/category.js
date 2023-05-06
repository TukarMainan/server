'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
    }
  }
  Category.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category name is required"
        },
        notEmpty: {
          msg: "Category name is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};