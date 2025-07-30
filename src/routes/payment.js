const router = require("express").Router();
const { createOrder, verifyPayment } = require("../controllers/payment");
const { userAuth } = require("../middleware/auth");

router.post("/payment/create", userAuth, createOrder);
router.post("/payment/webhook", verifyPayment)

module.exports = router;
