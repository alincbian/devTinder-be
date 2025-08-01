const { DataTypes } = require("sequelize");

const chatModel = (sequelize) => {
  return sequelize.define("Chat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
};

module.exports = chatModel;
