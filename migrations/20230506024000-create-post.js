'use strict';
const { conditionItemPostEnum, statusItemPostEnum } = require('../config/enumTypes');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.UUID
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
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
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      condition: {
        allowNull: false,
        type: Sequelize.ENUM(...conditionItemPostEnum)
      },
      CategoryId: {
        allowNull: false,
        references: {
          model: "Categories"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        type: Sequelize.UUID
      },
      status: {
        defaultValue: "active",
        type: Sequelize.ENUM(...statusItemPostEnum)
      },
      meetingPoint: {
        type: Sequelize.GEOMETRY("POINT")
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      price: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Posts');
  }
};