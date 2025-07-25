module.exports = (db) => {
  const { User, ConnectionRequest } = db;

  User.hasMany(ConnectionRequest, {
    foreignKey: "senderId",
    as: "SentRequests",
  });
  User.hasMany(ConnectionRequest, {
    foreignKey: "receiverId",
    as: "ReceivedRequests",
  });

  ConnectionRequest.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
  ConnectionRequest.belongsTo(User, {
    foreignKey: "receiverId",
    as: "Receiver",
  });
};
