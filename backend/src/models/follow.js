"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    listenerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    artistID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Follows', 
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
});

Follow.associate = (models) => {
    console.log("Associating Follow model");
    Follow.belongsTo(models.User, {
        as: 'Listener', foreignKey: 'listenerID',
    })
    Follow.belongsTo(models.User, {
        as: 'Artist', foreignKey: 'artistID',
    })
}

module.exports = Follow;
