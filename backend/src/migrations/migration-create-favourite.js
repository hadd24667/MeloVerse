'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Favourites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      listenerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng User
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      songID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Songs', // Tên bảng Song
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      albumID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Albums', // Tên bảng Album
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      artistID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', // Tên bảng User (người dùng với vai trò nghệ sĩ)
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Favourites');
  },
};
    