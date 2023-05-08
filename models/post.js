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
          args: [4],
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
          args: [4],
          msg: "Invalid category uuid format"
        }
      }
    },
    status: {
      type: DataTypes.ENUM(...statusItemPostEnum),
      defaultValue: "active"
    },
    meetingPoint: DataTypes.GEOMETRY("POINT"),
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Images is required"
        },
        notEmpty: {
          msg: "Images is required"
        },
        isValidArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Invalid images data structure');
          }

          if (value.length < 1 && value.length > 5) {
            throw new Error('Images must contain 1 to 5 image url');
          }
        },
        isValidUrlArray(value) {
          console.log(value);
          const isValid = value.every((url) => {
            const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
            return urlRegex.test(url);
          });
          if (!isValid) {
            throw new Error('Invalid image url format');
          }
        },
      }
    },
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};