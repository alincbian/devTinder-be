const jwt = require("jsonwebtoken");
const { User } = require("../models");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) return res.status(401).send({ message: "Please login!" });

    const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);

    const { id } = decodeObj;

    const user = await User.findByPk(id);

    if (!user) return res.status(401).send({ message: "User not found!" });

    req.user = user;

    next();
  } catch (err) {
    console.log("Userauth middeware error: ", err);
    res.status(400).send({ message: err.message });
  }
};

module.exports = { userAuth };
