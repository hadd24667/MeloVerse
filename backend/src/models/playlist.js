"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Playlist = sequelize.define('Playlist', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    listenerID: DataTypes.STRING,
    title: DataTypes.STRING,
    imagePath: DataTypes.TEXT,
    timeCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Playlists',
    timestamps: false,
});

Playlist.associate = (models) => {
    Playlist.belongsToMany(models.Song, {
        through: models.Playlist_Song,
        foreignKey: 'playlistID',
        otherKey: 'songID'
    });
    Playlist.belongsTo(models.User, {
        foreignKey: 'listenerID',
        as: 'llistener'
    });
};

module.exports = Playlist;
