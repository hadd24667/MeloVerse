"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Playlist_Song", {
      id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      playlistID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Playlists",
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
      timeAdded: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Playlist_Song");
  },
};
