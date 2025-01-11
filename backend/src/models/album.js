"use strict";

const {  DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    artistID: {
        type : DataTypes.INTEGER,
        allowNull: false,
    },
    title: DataTypes.STRING,
    imagePath: DataTypes.TEXT,
    description: DataTypes.TEXT,
    releaseDate: DataTypes.DATE,
}, {
    tableName: 'Albums',
    timestamps: false
});
Album.associate = (models) => {
    Album.belongsTo(models.User, { as: 'Artist', foreignKey: 'artistID' }); 
    Album.hasMany(models.Song, { as: 'songs', foreignKey: 'albumID' }); 
};

module.exports = Album;