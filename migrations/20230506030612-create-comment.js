'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      UserId: {
        allowNull: false,
        references: {
          model: "Users"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      PostId: {
        allowNull: false,
        references: {
          model: "Posts"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Comments');
  }
};