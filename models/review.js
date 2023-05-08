'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "UserReview"
      });
      this.belongsTo(models.User, {
        foreignKey: "SenderId",
        as: "SenderReview"
      });
      this.belongsTo(models.Post, {
        foreignKey: "PostId"
      });
    }
  }
  Review.init({
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
    SenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User sender uuid is required"
        },
        notEmpty: {
          msg: "User sender uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid user sender uuid format"
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
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Rating is required"
        },
        notEmpty: {
          msg: "Rating is required"
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
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};