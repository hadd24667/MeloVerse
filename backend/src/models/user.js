"use strict";
const Follow = require('./follow');
const Collaborator = require('./collaborator');
const Song = require('./song');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['admin', 'listener', 'artist']],
        },
    },
    profile: DataTypes.TEXT,
    imagePath: DataTypes.TEXT,
    artistRegister : DataTypes.BOOLEAN,
    requestDate : DataTypes.DATE,
}, {
    tableName: 'Users',
    timestamps: false
});

User.associate = (models) => {
    User.hasMany(models.Song, { as: 'Songs', foreignKey: 'artistID' });
    User.hasMany(models.Follow, { as: 'Followers', foreignKey: 'artistID' });
    User.hasMany(models.Queue, { as: 'Queues', foreignKey: 'listenerID' });
    User.hasMany(models.Album, { as: 'Albums', foreignKey: 'artistID' });
    User.belongsToMany(models.Song, {
        through: models.Collaborator,
        as: 'CollaboratedSongs',
        foreignKey: 'artistID',
        otherKey: 'songID',
    });
    User.hasMany(models.History, { as: 'histories', foreignKey: 'listenerID' });
};

module.exports = User;