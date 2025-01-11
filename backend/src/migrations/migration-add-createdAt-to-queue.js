module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('queue', 'createdAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('queue', 'createdAt');
    },
  };
  