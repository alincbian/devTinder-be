const { DataTypes } = require("sequelize");

const userModel = (sequelize) => {
  return sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [3, 50],
          msg: "First name must be between 3 and 50 characters",
        },
        notNull: { msg: "First name is required" },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [3, 50],
          msg: "Last name must be between 3 and 50 characters",
        },
      },
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("emailId", value.toLowerCase().trim());
      },
      validate: {
        isEmail: { msg: "Invalid email format" },
        notNull: { msg: "Email is required" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        len: {
          args: [8, 100],
          msg: "Password must be at least 8 characters",
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: 18,
          msg: "Minimum age is 18",
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
      validate: {
        isIn: {
          args: [["male", "female", "other"]],
          msg: "Gender must be male, female, or other",
        },
      },
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    membershipType: {
      type: DataTypes.STRING,
    },
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue:
        "https://cdn.pixabay.com/photo/2017/03/21/02/00/user-2160923_640.png",
      validate: {
        isUrl: { msg: "Invalid photo URL" },
      },
    },
    about: {
      type: DataTypes.STRING,
      defaultValue: "This is default about of a user!",
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  });
};

module.exports = userModel;
