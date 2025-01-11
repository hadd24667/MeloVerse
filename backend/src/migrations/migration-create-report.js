"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reports", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      listenerID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      commentID: {
        type : Sequelize.INTEGER,
        references: {
          model: "Comments",
          key: "id",
        },
      },
      songID: {
        type : Sequelize.INTEGER,
        references: {
          model: "Songs",
          key: "id",
        },
      },
      reason: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isResolved: {
        type: Sequelize.BOOLEAN,
      },
      timeCreated: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reports");
  },
};
