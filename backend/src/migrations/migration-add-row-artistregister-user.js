"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Users", "artistRegister", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Users", "artistRegister");
    },
};