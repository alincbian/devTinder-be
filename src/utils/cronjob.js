const cron = require("node-cron");
const { ConnectionRequest, User } = require("../models");
const { subDays, endOfDay, startOfDay } = require("date-fns");
const { Op } = require("sequelize");
const emailQueue = require("./queue");

cron.schedule("0 8 * * *", async () => {
  // sende emails to all people who got requests the previous day

  const yesterday = subDays(new Date(), 1);

  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    const pendingRequests = await ConnectionRequest.findAll({
      where: {
        status: "interested",
        createdAt: {
          [Op.gte]: yesterdayStart,
          [Op.lt]: yesterdayEnd,
        },
      },
      include: [
        {
          model: User,
          as: "Sender",
        },
        {
          model: User,
          as: "Receiver",
        },
      ],
    });

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.Receiver.emailId)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      await emailQueue.add("send-email-job", { email });
    }

    console.log("All Jobs Added to Queue");
  } catch (err) {
    console.log(err);
  }
});
