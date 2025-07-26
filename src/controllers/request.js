const { Op } = require("sequelize");
const { User, ConnectionRequest } = require("../models");

const sendEmail = require("../utils/sendEmail");

const sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { status, receiverId } = req.params;

    const allowedStatus = ["interested", "ignored"];

    if (!allowedStatus?.includes(status))
      return res.status(401).json({ message: "Invalid status!" });

    const checkReceiver = await User.findByPk(receiverId);

    if (!checkReceiver)
      return res.status(401).json({ message: "User not found!" });

    if (senderId === Number(receiverId))
      return res
        .status(401)
        .json({ message: "Connection request not allowed to yourself!" });

    const existingRequest = await ConnectionRequest.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingRequest)
      return res.status(401).json({ message: "Request already exist" });

    const connectionRequest = await ConnectionRequest.create({
      senderId,
      receiverId,
      status,
    });

    const emailRes = await sendEmail.run(
      `A new friend request from ${checkReceiver?.firstName}`,
      `${req.user.firstName} is ${status} in ${checkReceiver?.firstName}`
    );

    console.log(emailRes);

    if (connectionRequest)
      res.status(201).json({
        message: `${req.user.firstName} is ${status} in ${checkReceiver?.firstName}`,
        data: connectionRequest,
      });
  } catch (err) {
    console.log("Request sent error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus?.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const connectionRequest = await ConnectionRequest.findOne({
      where: {
        id: requestId,
        receiverId: loggedInUser?.id,
        status: "interested",
      },
    });

    if (!connectionRequest)
      return res.status(404).json({ message: "Connection request not found!" });

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.status(200).json({ message: `Connection request ${status}`, data });
  } catch (err) {
    console.log("Review request error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

module.exports = { sendRequest, reviewRequest };
