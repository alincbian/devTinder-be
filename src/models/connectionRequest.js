const { DataTypes } = require("sequelize");

const connectionRequestModel = (sequelize) => {
  return sequelize.define("ConnectionRequest", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("interested", "ignored", "accepted", "rejected"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["interested", "ignored", "accepted", "rejected"]],
          msg: "Invalid status value",
        },
      },
    },
  });
};

module.exports = connectionRequestModel;
