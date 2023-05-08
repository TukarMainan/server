'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Reviews", "rating", {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    })
    await queryInterface.removeColumn("Users", "ratings");
    await queryInterface.addColumn("Users", "ratings", {
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Reviews", "rating");
    await queryInterface.removeColumn("Users", "ratings");
    await queryInterface.addColumn("Users", "ratings", {
      defaultValue: 0,
      type: Sequelize.INTEGER
    })
  }
};
