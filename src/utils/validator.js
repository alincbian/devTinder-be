const validator = require("validator");

const validateSignupApi = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateLoginApi = (emailId) => {
  if (!validator.isEmail(emailId)) throw new Error("Please enter valid email!");
};

const validateEditProfileAPi = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];

  const allowed = Object.keys(req.body)?.every((item) =>
    allowedEditFields?.includes(item)
  );

  const { photoUrl, skills } = req.body;

  if (!allowed) {
    throw new Error("Invalid edit fields");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Invalid photo url");
  } else if (skills && skills?.length > 10) {
    throw new Error("Skills length should not be more than 10");
  }
};

const validateUpdatePasswordApi = (req) => {
  const allowedFields = ["oldPassword", "newPassword"];

  const allowed = Object.keys(req.body)?.every((item) =>
    allowedFields?.includes(item)
  );

  const { oldPassword, newPassword } = req.body;

  if (!allowed) {
    throw new Error("Invalid fields");
  } else if (!oldPassword || !newPassword) {
    throw new Error("All fields are required!");
  } else if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Please enter a strong new password");
  }
};

module.exports = {
  validateSignupApi,
  validateLoginApi,
  validateEditProfileAPi,
  validateUpdatePasswordApi,
};
