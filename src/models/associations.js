module.exports = (db) => {
  const { User, ConnectionRequest, Payment } = db;

  User.hasMany(ConnectionRequest, {
    foreignKey: "senderId",
    as: "SentRequests",
  });
  User.hasMany(ConnectionRequest, {
    foreignKey: "receiverId",
    as: "ReceivedRequests",
  });

  User.hasMany(Payment, {
    foreignKey: "userId",
    as: "Payments",
  });

  ConnectionRequest.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
  ConnectionRequest.belongsTo(User, {
    foreignKey: "receiverId",
    as: "Receiver",
  });

  Payment.belongsTo(User, { foreignKey: "userId", as: "User" });
};
