"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    listenerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commentID: {
        type: DataTypes.INTEGER,
    },
    songID: {
        type: DataTypes.INTEGER,
    },
    reason: DataTypes.TEXT,
    timeCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    isResolved: {
        type: DataTypes.BOOLEAN,
    },
}, {
    tableName: 'Reports',
    timestamps: false,
});

Report.associate = (models) => {
    // Định nghĩa quan hệ ở đây nếu cần
};

module.exports = Report;
