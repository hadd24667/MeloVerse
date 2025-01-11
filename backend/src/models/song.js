"use strict";
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Song = sequelize.define('Song', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    trackTitle: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    artistID: DataTypes.STRING,
    albumID: DataTypes.STRING,
    genre: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['vpop', 'kpop', 'us-uk', 'edm', 'vinahouse', 'chill', 'ballad','rap']],
        },
    },
    lyrics: DataTypes.TEXT,
    filePath: DataTypes.TEXT,
    imagePath: DataTypes.TEXT,
    releaseDate: DataTypes.DATE,
    plays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    duration: DataTypes.INTEGER,
    position: DataTypes.INTEGER,
}, {
    tableName: 'Songs',
    timestamps: false
});

Song.associate = (models) => {
    Song.belongsTo(models.User, { as: 'Artist', foreignKey: 'artistID' });
    Song.belongsTo(models.Album, { as: 'Album', foreignKey: 'albumID' });
    Song.belongsToMany(models.User, {
        through: {
            model: models.Collaborator,
            unique: false,
            timestamps: false // Disable timestamps in the join table
        },
        as: 'Collaborators',
        foreignKey: 'songID',
        otherKey: 'artistID',
    });
    Song.hasMany(models.History, { as: 'histories', foreignKey: 'songID' });
    Song.belongsToMany(models.Playlist, {
        through: models.Playlist_Song,
        foreignKey: 'songID',
        otherKey: 'playlistID'
    });
};


module.exports = Song;