'use strict';
const {
  Model
} = require('sequelize');
const { statusTradeEnum } = require('../config/enumTypes');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "SenderUserId",
        as: "SenderUser"
      });
      this.belongsTo(models.Post, {
        foreignKey: "SenderPostId",
        as: "SenderPost"
      });
      this.belongsTo(models.Post, {
        foreignKey: "TargetPostId",
        as: "TargetPost"
      });
    }
  }
  Trade.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    SenderPostId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Sender post uuid is required"
        },
        notEmpty: {
          msg: "Sender post uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid Sender post uuid format"
        }
      }
    },
    TargetPostId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Target post uuid is required"
        },
        notEmpty: {
          msg: "Target post uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid Target post uuid format"
        }
      }
    },
    SenderUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Sender user uuid is required"
        },
        notEmpty: {
          msg: "Sender user uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid Sender user uuid format"
        }
      }
    },
    TargetUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Target user uuid is required"
        },
        notEmpty: {
          msg: "Target user uuid is required"
        },
        isUUID: {
          args: [4],
          msg: "Invalid Target user uuid format"
        }
      }
    },
    Status: {
      type: DataTypes.ENUM(...statusTradeEnum),
      defaultValue:"requesting"
    }
  }, {
    sequelize,
    modelName: 'Trade',
  });
  return Trade;
};