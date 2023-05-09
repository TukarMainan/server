'use strict';

const { statusTradeEnum } = require('../config/enumTypes');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trades', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      SenderPostId: {
        allowNull: false,
        references: {
          model: "Posts"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      TargetPostId: {
        allowNull: false,
        type: Sequelize.UUID
      },
      SenderUserId: {
        allowNull: false,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      TargetUserId: {
        allowNull: false,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      Status: {
        defaultValue:"requesting",
        type: Sequelize.ENUM(...statusTradeEnum)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trades');
  }
};