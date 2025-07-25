const { User } = require("../models");
const { validateSignupApi, validateLoginApi } = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    validateSignupApi(req);

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ where: { emailId } });

    if (existingUser)
      return res.status(409).json({ message: "User already exist!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const token = await jwt.sign({ id: user?.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({ message: "Signup successfully!", user });
  } catch (err) {
    console.log("Signup error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginApi(emailId);

    const user = await User.findOne({ where: { emailId } });

    if (!user) return res.status(401).json({ message: "Invalid credentials!" });

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = await jwt.sign({ id: user?.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "Loggedin successfully!", user });
  } catch (err) {
    console.log("login error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.status(200).send({ message: "Logout Successfully" });
};

module.exports = {
  signUp,
  login,
  logout,
};
