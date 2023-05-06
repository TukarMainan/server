'use strict';
const {
  Model
} = require('sequelize');
const { statusReportEnum } = require('../config/enumTypes');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // define association here
    }
  }
  Report.init({
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
    },
    status: {
      type: DataTypes.ENUM(...statusReportEnum),
      defaultValue: "open"
    }
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};