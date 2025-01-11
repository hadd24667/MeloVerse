"use strict";

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favourite = sequelize.define('Favourite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    listenerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    songID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    albumID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    artistID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

 Favourite.addHook('beforeValidate', (favourite) => {
  const fields = [favourite.songID, favourite.albumID, favourite.artistID];
  const filledFields = fields.filter(field => field != null); // Lọc bỏ null/undefined
  if (filledFields.length !== 1) {
    throw new Error('Only one of songID, albumID, or artistID must be set.');
  }
});

  
  Favourite.associate = (models) => {
    Favourite.belongsTo(models.User, { foreignKey: 'listenerID', as: 'user' }); // Liên kết với bảng User (người thêm vào yêu thích)
    Favourite.belongsTo(models.Song, { foreignKey: 'songID', as: 'song' }); // Liên kết với bảng Song
    Favourite.belongsTo(models.Album, { foreignKey: 'albumID', as: 'album' }); // Liên kết với bảng Album
    Favourite.belongsTo(models.User, { foreignKey: 'artistID', as: 'artist' }); // Liên kết với bảng User (nghệ sĩ)
  };

module.exports = Favourite;