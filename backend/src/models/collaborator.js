"use strict";

const User = require('./user');
const Song = require('./song');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Collaborator = sequelize.define('Collaborator', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    artistID: {
        type: DataTypes.INTEGER,
    },
    songID: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'Collaborators',
    timestamps: false
});

Collaborator.associate = (models) => {
    Collaborator.belongsTo(models.User, { as: 'Artist', foreignKey: 'artistID' });
    Collaborator.belongsTo(models.Song, { as: 'Song', foreignKey: 'songID' });
}

module.exports = Collaborator;