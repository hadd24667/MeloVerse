"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Queue = sequelize.define('Queue', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    listenerID: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    songID: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'Queues',
    timestamps: false,
});

Queue.associate = (models) => {
    Queue.belongsTo(models.User, { as: 'Listener', foreignKey: 'listenerID' });
    Queue.belongsTo(models.Song, { as: 'Song', foreignKey: 'songID' });
};

module.exports = Queue;