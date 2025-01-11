module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addConstraint("Histories", {
        fields: ["listenerID", "songID"],
        type: "unique",
        name: "unique_listener_song", // Tên ràng buộc
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeConstraint("Histories", "unique_listener_song");
    },
  };
  