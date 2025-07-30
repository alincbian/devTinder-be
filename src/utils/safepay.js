const { Safepay } = require("@sfpy/node-sdk");

if (!process.env.SAFEPAY_API_KEY || !process.env.SAFEPAY_API_SECRET) {
  throw new Error(
    "Missing Safepay API key or secret in environment variables."
  );
}

const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENV,
  apiKey: process.env.SAFEPAY_API_KEY,
  apiSecret: process.env.SAFEPAY_API_SECRET,
  v1Secret: "bar",
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

module.exports = safepay;
