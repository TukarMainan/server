'use strict';
const crypto = require('crypto');
const { hashPassword } = require('../helpers');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../config/database.json");
    const currentDate = new Date();

    const admins = data.admins.map(el => {
      el.createdAt = el.updatedAt = currentDate;
      return el;
    });

    for (const admin of admins) {
      admin.password = await hashPassword(admin.password);
    }

    const users = data.users.map(el => {
      el.createdAt = el.updatedAt = currentDate;
      el.token = crypto.randomBytes(32).toString('hex');
      return el;
    });

    for (const user of users) {
      user.password = await hashPassword(user.password);
    }

    const categories = data.categories.map(el => {
      el.createdAt = el.updatedAt = currentDate;
      return el;
    })

    const posts = data.posts.map(el => {
      el.createdAt = el.updatedAt = currentDate;
      el.meetingPoint = Sequelize.fn(
        'ST_GeomFromText',
        Sequelize.literal(`'POINT(${el.meetingPoint.longitude} ${el.meetingPoint.latitude})'`),
        '4326'
      );
      return el;
    })

    await queryInterface.bulkInsert("Admins", admins);
    await queryInterface.bulkInsert("Users", users);
    await queryInterface.bulkInsert("Categories", categories);
    await queryInterface.bulkInsert("Posts", posts);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete("Users", null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete("Categories", null, { truncate: true, cascade: true, restartIdentity: true });
    await queryInterface.bulkDelete("Posts", null, { truncate: true, cascade: true, restartIdentity: true });
  }
};
