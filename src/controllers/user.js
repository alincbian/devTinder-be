const { Op, DataTypes } = require("sequelize");
const { ConnectionRequest, User } = require("../models");

const USER_SAFE_DATA = [
  "id",
  "firstName",
  "lastName",
  "photoUrl",
  "gender",
  "age",
  "skills",
  "about",
];

const requestsReceived = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.findAll({
      where: { receiverId: loggedInUser?.id, status: "interested" },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: USER_SAFE_DATA,
        },
      ],
    });

    res.status(200).json({
      message: "Requests fetched successfully!",
      data: connectionRequests,
    });
  } catch (err) {
    console.log("Requests receiver error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const userConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.findAll({
      where: {
        [Op.or]: [
          { senderId: loggedInUser?.id, status: "accepted" },
          { receiverId: loggedInUser?.id, status: "accepted" },
        ],
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: USER_SAFE_DATA,
        },
        {
          model: User,
          as: "Receiver",
          attributes: USER_SAFE_DATA,
        },
      ],
    });

    const data = connections?.map((item) => {
      if (item?.senderId === loggedInUser?.id) {
        return item?.Receiver;
      }

      return item?.Sender;
    });

    res.status(200).json({ data });
  } catch (err) {
    console.log("User connections error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

const feed = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.findAll({
      where: {
        [Op.or]: [
          { senderId: loggedInUser?.id },
          { receiverId: loggedInUser?.id },
        ],
      },
      attributes: ["id", "senderId", "receiverId"],
    });

    const hideUsersFromFeed = new Set();

    connectionRequests?.forEach((item) => {
      hideUsersFromFeed.add(item?.senderId);
      hideUsersFromFeed.add(item?.receiverId);
    });

    const users = await User.findAll({
      where: {
        id: {
          [Op.and]: [
            { [Op.notIn]: Array.from(hideUsersFromFeed) },
            { [Op.ne]: loggedInUser?.id },
          ],
        },
      },
      attributes: USER_SAFE_DATA,
      offset: skip,
      limit,
    });

    res.status(200).json({ data: users });
  } catch (err) {
    console.log("Feed error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

module.exports = { requestsReceived, userConnections, feed };
