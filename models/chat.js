'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "SenderId",
        as: "SenderUser"
      });
      this.belongsTo(models.User, {
        foreignKey: "ReceiverId",
        as: "ReceiverUser"
      });
      this.hasMany(models.Message, {
        foreignKey: "ChatId"
      });
    }
  }
  Chat.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    SenderId: {
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
          msg: "Invalid sender uuid format"
        }
      }
    },
    ReceiverId: {
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
          msg: "Invalid receiver uuid format"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};