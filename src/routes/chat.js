const router = require("express").Router();

const { getChat } = require("../controllers/chat");
const { userAuth } = require("../middleware/auth");

router.get("/chat/:targetUserId", userAuth, getChat);

module.exports = router;
