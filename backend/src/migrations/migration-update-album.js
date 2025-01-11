"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Albums", "description", {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Albums", "description");
  },
};