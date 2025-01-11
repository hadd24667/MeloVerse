"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Songs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trackTitle: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      artistID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      albumID: {
        type: Sequelize.INTEGER,
        references: {
          model: "Albums",
          key: "id",
        },
      },
      genre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lyrics: {
        type: Sequelize.TEXT,
      },
      filePath: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      imagePath: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      releaseDate: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      plays: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Songs");
  },
};