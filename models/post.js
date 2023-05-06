'use strict';
const {
  Model
} = require('sequelize');
const { conditionItemPostEnum, statusItemPostEnum } = require('../config/enumTypes');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId"
      });
      this.belongsTo(models.Category, {
        foreignKey: "CategoryId"
      });
      this.hasOne(models.Review, {
        foreignKey: "PostId"
      });
      this.hasMany(models.Comment, {
        foreignKey: "PostId"
      });
      this.hasMany(models.Report, {
        foreignKey: "PostId"
      });
    }
  }
  Post.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title is required"
        },
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User uuid is required"
        },
        notEmpty: {
          msg: "User uuid is required"
        },
        isUUID: {
          msg: "Invalid user uuid format"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description is required"
        },
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    condition: {
      type: DataTypes.ENUM(...conditionItemPostEnum),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Condition is required"
        },
        notEmpty: {
          msg: "Condition is required"
        }
      }
    },
    CategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category is required"
        },
        notEmpty: {
          msg: "Category is required"
        },
        isUUID: {
          msg: "Invalid category uuid format"
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...statusItemPostEnum),
      defaultValue: "active"
    },
    meetingPoint: DataTypes.GEOMETRY("POINT"),
    images: DataTypes.ARRAY(DataTypes.STRING),
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};