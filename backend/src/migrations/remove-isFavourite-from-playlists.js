'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Xóa cột isFavourite khỏi bảng Playlists
    await queryInterface.removeColumn('Playlists', 'isFavourite');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Playlists', 'isFavourite', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Tùy chọn
      defaultValue: false, // Giá trị mặc định
    });
  },
};
