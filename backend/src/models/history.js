"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
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
    timeListened: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    totalListenTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'Histories',
    timestamps: false,
    indexes: [
        {
          unique: true,
          fields: ["listenerID", "songID"], // Ràng buộc tính duy nhất
        },
      ],
});

History.associate = (models) => {
    History.belongsTo(models.Song, { as: 'song', foreignKey: 'songID' });
    History.belongsTo(models.User, { as: 'listener', foreignKey: 'listenerID' });
};

module.exports = History;