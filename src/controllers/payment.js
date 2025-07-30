const { Payment, User } = require("../models");
const { membershipAmount } = require("../utils/constants");
const safepay = require("../utils/safepay");
const { v4: uuidv4 } = require("uuid");

const createPaymentToken = async (amount) => {
  const { token } = await safepay.payments.create({
    amount,
    currency: "PKR",
  });

  return token;
};

const createCheckoutUrl = async (paymentToken, orderId) => {
  const url = safepay.checkout.create({
    token: paymentToken,
    orderId,
    cancelUrl: "http://localhost:5173/premium",
    redirectUrl: "http://localhost:5173/premium",
    source: "custom",
    webhooks: true,
  });

  return url;
};

const createOrder = async (req, res) => {
  try {
    const { membershipType } = req.body;
    const amount = membershipAmount[membershipType] * 100;

    const orderId = uuidv4();

    const paymentToken = await createPaymentToken(amount);

    if (!paymentToken)
      return res.status(400).json({ message: "Invalid token" });

    const checkoutUrl = await createCheckoutUrl(paymentToken, orderId);

    if (!checkoutUrl)
      return res.status(400).json({ message: "Invalid checkout url" });

    const payment = await Payment.create({
      userId: req.user.id,
      orderId,
      paymentToken,
      amount,
      currency: "PKR",
      status: "pending",
      membershipType,
    });

    return res.status(201).json({
      message: "Order created succesfully!",
      data: payment,
      checkoutUrl,
    });
  } catch (err) {
    console.log("Create order error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("Webhook Called");
    const isValid = await safepay.verify.webhook(req);

    if (!isValid) {
      console.log("Invalid webhook signature");

      return res.status(400).json({ message: "Webhook signature is invalid" });
    }

    console.log("Valid webhook signature");

    const { notification } = req?.body?.data;

    console.log(req?.body?.data);
    console.log(notification);

    const payment = await Payment.findOne({
      where: { orderId: notification?.metadata?.order_id },
    });

    if (!payment) {
      console.log("Payment not found");
      return res.status(400).json({ message: "Payment not found" });
    }

    payment.status = notification?.state === "PAID" ? "success" : "failed";
    await payment.save();

    console.log("Payment saved");

    const user = await User.findOne({ where: { id: payment?.userId } });

    user.isPremium = true;
    user.membershipType = payment?.membershipType;

    await user.save();

    console.log("User Saved");

    return req.status(200).json({ messge: "Webhook received successfully" });
  } catch (err) {
    console.log("Verify payment error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
