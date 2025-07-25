const router = require("express").Router();
const { sendRequest, reviewRequest } = require("../controllers/request");
const { userAuth } = require("../middleware/auth");

router.post("/request/send/:status/:receiverId", userAuth, sendRequest);
router.post("/request/review/:status/:requestId", userAuth, reviewRequest);

module.exports = router;
