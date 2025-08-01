const { Sequelize } = require("sequelize");
const userModel = require("./user.js");
const connectionRequestModel = require("./connectionRequest.js");
const paymentModel = require("./payment.js");
const config = require("../config/database.js").development;
const modelAssociations = require("./associations.js");
const chatModel = require("./chat.js");
const messageModel = require("./messageModel.js");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = userModel(sequelize);
db.ConnectionRequest = connectionRequestModel(sequelize);
db.Payment = paymentModel(sequelize);
db.Chat = chatModel(sequelize);
db.Message = messageModel(sequelize);

modelAssociations(db);

module.exports = db;
