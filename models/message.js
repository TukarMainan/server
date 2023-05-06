'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Chats,{
        foreignKey:"ChatId"}
        );
    }
  }
  Message.init({
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
    ChatId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Chat uuid is required"
        },
        notEmpty: {
          msg: "Chat uuid is required"
        },
        isUUID: {
          msg: "Invalid chat uuid format"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};