"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Histories", {
      id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      listenerID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      songID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Songs",
          key: "id",
        },
      },
      timeListened: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Histories");
  },
};
