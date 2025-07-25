const router = require("express").Router();
const {
  requestsReceived,
  userConnections,
  feed,
} = require("../controllers/user");
const { userAuth } = require("../middleware/auth");

router.get("/user/requests/received", userAuth, requestsReceived);
router.get("/user/connections", userAuth, userConnections);
router.get("/feed", userAuth, feed);

module.exports = router;
