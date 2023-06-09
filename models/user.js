'use strict';
const {
  Model
} = require('sequelize');
const { statusUserEnum } = require("../config/enumTypes");
const { hashPassword } = require('../helpers');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Chat, {
        foreignKey: "SenderId",
        as: "SenderChats"
      });
      this.hasMany(models.Chat, {
        foreignKey: "ReceiverId",
        as: "ReceiverChats"
      });
      this.hasMany(models.Review, {
        foreignKey: "UserId",
        as: "UserReviews"
      });
      this.hasMany(models.Review, {
        foreignKey: "SenderId",
        as: "SenderReviews"
      });
      this.hasMany(models.Notification, {
        foreignKey: "UserId"
      });
      this.hasMany(models.Comment, {
        foreignKey: "UserId"
      });
      this.hasMany(models.Report, {
        foreignKey: "UserId"
      });
      this.hasMany(models.Post, {
        foreignKey: "UserId"
      });
      this.hasMany(models.Trade, {
        foreignKey: "SenderUserId",
        as: "SenderUser"
      })
    }
  }
  User.init({
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
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid profile image url"
        }
      }
    },
    backgroundImg: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid background image url"
        }
      }
    },
    name: DataTypes.STRING,
    notes: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM(...statusUserEnum),
      defaultValue: "unverified"
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "City is required"
        },
        notEmpty: {
          msg: "City is required"
        }
      }
    },
    ratings: {
      type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    warningCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Token is required"
        },
        notEmpty: {
          msg: "Token is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeBulkCreate(async (users) => {
    for (let i = 0; i < users.length; i++) {
      users[i].password = await hashPassword(users[i].password);
    }
  })

  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  })

  return User;
};