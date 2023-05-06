'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'warningCount', {
      defaultValue: 0,
      type: Sequelize.INTEGER
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "warningCount");
  }
};
