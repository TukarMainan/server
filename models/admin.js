'use strict';
const { hashPassword } = require('../helpers');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      this.hasMany(models.AdminLog, {
        foreignKey: "AdminId"
      });
    }
  }
  Admin.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email already exists"
      },
      validate: {
        notNull: {
          msg: "Email is required"
        },
        notEmpty: {
          msg: "Email is required"
        },
        isEmail: {
          msg: "Invalid email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required"
        },
        notEmpty: {
          msg: "Password is required"
        },
        len: {
          args: [8, 255],
          msg: "Password must have at least 8 characters"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Username already exists"
      },
      validate: {
        notNull: {
          msg: "Username is required"
        },
        notEmpty: {
          msg: "Username is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Admin',
  });

  Admin.beforeCreate(async (admin) => {
    admin.password = await hashPassword(admin.password);
  })

  return Admin;
};