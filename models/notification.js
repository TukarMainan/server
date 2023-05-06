'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "UserId"
      });
    }
  }
  Notification.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
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
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};