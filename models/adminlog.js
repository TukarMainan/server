'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminLog extends Model {
    static associate(models) {
      this.belongsTo(models.Admin, {
        foreignKey: "AdminId"
      });
    }
  }
  AdminLog.init({
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
          msg: "Log name is required"
        },
        notEmpty: {
          msg: "Log name is required"
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
    AdminId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Admin uuid is required"
        },
        notEmpty: {
          msg: "Admin uuid is required"
        },
        isUUID: {
          msg: "Invalid admin uuid format"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'AdminLog',
  });
  return AdminLog;
};