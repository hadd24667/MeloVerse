"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
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
      content: {
        type: Sequelize.STRING(50),
      },
      isResolved: {
        type: Sequelize.BOOLEAN,
      },
      timeCreated: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  },
};
