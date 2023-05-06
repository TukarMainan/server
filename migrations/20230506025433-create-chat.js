'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      SenderId: {
        allowNull: false,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      ReceiverId: {
        allowNull: false,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
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
    await queryInterface.dropTable('Chats');
  }
};