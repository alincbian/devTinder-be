const { Chat, User, sequelize, Message } = require("../models");

const getChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId } = req.params;

    const chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: "Participants",
          attributes: ["id", "firstName", "lastName"],
          through: { attributes: [] },
          where: { id: [userId, targetUserId] },
        },
        {
          model: Message,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
      subQuery: false,
    });

    let chat = chats.find((chat) => chat.Participants.length === 2) || null;

    console.log(chat, "chat");

    if (!chat) {
      chat = await Chat.create();
      await chat.addParticipants([userId, targetUserId]);

      chat = await chat.findByPk(chat.id, {
        include: [
          {
            model: User,
            as: "Participants",
            attributes: ["id", "firstName", "lastName"],
            through: { attributes: [] },
            where: { id: [userId, targetUserId] },
          },
          {
            model: Message,
            include: [
              {
                model: User,
                as: "sender",
                attributes: ["id", "firstName", "lastName"],
              },
            ],
          },
        ],
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log("Get chat error", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

module.exports = { getChat };
