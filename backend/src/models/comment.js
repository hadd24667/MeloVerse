"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    listenerID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    songID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: DataTypes.STRING(50),
    timeCreated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'Comments',
    timestamps: false,
});

Comment.associate = (models) => {
    // Định nghĩa quan hệ ở đây nếu cần
};

module.exports = Comment;
