const { Sequelize } = require("sequelize");
const userModel = require("./user.js");
const connectionRequestModel = require("./connectionRequest.js");
const config = require("../config/database.js").development;
const modelAssociations = require("./associations.js");

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

modelAssociations(db);

module.exports = db;
