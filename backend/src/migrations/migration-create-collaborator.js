"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Collaborators", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            artistID: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            songID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Songs",
                    key: "id",
                },
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Collaborators");
    },
};