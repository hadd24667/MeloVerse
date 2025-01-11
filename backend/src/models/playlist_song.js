"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Playlist_Song = sequelize.define('Playlist_Song', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    playlistID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    songID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timeAdded: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Playlist_Songs',
    timestamps: false,
});

Playlist_Song.associate = (models) => {
    Playlist_Song.belongsTo(models.Playlist, {
        foreignKey: 'playlistID'
    });
    
    Playlist_Song.belongsTo(models.Song, {
        foreignKey: 'songID'
    });
};

module.exports = Playlist_Song;
