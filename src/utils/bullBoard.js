const express = require("express");
const { createBullBoard } = require("@bull-board/api");
const { ExpressAdapter } = require("@bull-board/express");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { Queue } = require("bullmq");
const Redis = require("ioredis");

const app = express();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

// Queue Reference
const emailQueue = new Queue("email-queue", { connection });

const { addQueue, removeQueue, setQueues } = createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3001, () => {
  console.log("Bull Board is running on http://localhost:3001/admin/queues");
});
