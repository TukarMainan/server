'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId"
      });
      this.belongsTo(models.Post, {
        foreignKey: "PostId"
      });
    }
  }
  Comment.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
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
    PostId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Post uuid is required"
        },
        notEmpty: {
          msg: "Post uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid post uuid format"
        }
      }
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Message is required"
        },
        notEmpty: {
          msg: "Message is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};