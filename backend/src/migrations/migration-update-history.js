"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Histories', 'totalListenTime', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Histories', 'totalListenTime');
  },
};

// npx sequelize-cli db:migrate --name migration-update-history.js