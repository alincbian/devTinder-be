const { DataTypes } = require("sequelize");

const paymentModel = (sequelize) => {
  return sequelize.define("Payment", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    orderId: {
      type: DataTypes.STRING,
    },
    paymentToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "PKR",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
    },
    membershipType: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = paymentModel;
