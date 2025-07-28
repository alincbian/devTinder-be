const express = require("express");
const db = require("./models");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv");

require("./utils/cronjob");
require("./utils/worker");
require("./utils/bullBoard"); // visual view of BullMq Queues

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully.");

    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err.message);
  });
