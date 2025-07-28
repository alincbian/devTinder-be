const { Worker } = require("bullmq");
const Redis = require("ioredis");
const sendEmail = require("./sendEmail");

const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Processing Job:", job.data);

    const { email } = job.data;

    try {
      const res = await sendEmail.run(
        `New Friend Requests pending for ${email}`,
        "There are so many friend requests pending, please login to DevTinder and accept or reject"
      );

      console.log("Email sent to:", email);

      //   console.log(res);
    } catch (err) {
      console.error("Failed to send email:", err);
      throw err;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job) => {
  console.log(`Job ${job.id} failed`);
});
