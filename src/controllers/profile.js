const bcrypt = require("bcrypt");
const {
  validateEditProfileAPi,
  validateUpdatePasswordApi,
} = require("../utils/validator");

const viewProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json(user);
  } catch (err) {
    console.log("Profile view error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const editProfile = async (req, res) => {
  try {
    validateEditProfileAPi(req);

    const loggedInUser = req.user;

    Object.keys(req.body)?.forEach(
      (item) => (loggedInUser[item] = req.body[item])
    );

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser?.firstName}, your Profile updated successfully!`,
      user: loggedInUser,
    });
  } catch (err) {
    console.log("Profile edit error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const updatePassword = async (req, res) => {
  try {
    validateUpdatePasswordApi(req);

    const { oldPassword, newPassword } = req.body;

    const loggedInUser = req.user;

    const matchOldPassword = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );

    if (!matchOldPassword)
      return res.status(401).json({ message: "Old password is incorrect!" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedNewPassword;

    await loggedInUser.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.log("Update password error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

module.exports = { viewProfile, editProfile, updatePassword };
