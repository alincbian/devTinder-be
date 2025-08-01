const { DataTypes } = require("sequelize");

const messageModel = (sequelize) => {
  return sequelize.define("Message", {
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};

module.exports = messageModel;
