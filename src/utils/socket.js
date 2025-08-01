const socket = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Chat, User, sequelize, Message } = require("../models");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId]?.sort()?.join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware to authenticate socket connection using Cookie Token

  io.use(async (socket, next) => {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) return next(new Error("No cookies found"));

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies["token"];

    if (!token) return next(new Error("No token found in cookies"));

    try {
      const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decodeObj?.id;

      next();
    } catch (err) {
      console.error("JWT verification failed", err);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected with ID: ${socket.userId}`);

    // Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);

      console.log(firstName + " joining room " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          console.log(firstName + " " + text);

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

          let chat =
            chats.find((chat) => chat.Participants.length === 2) || null;

          if (!chat) {
            chat = await Chat.create();
            await chat.addParticipants([userId, targetUserId]);
          }

          const message = await Message.create({
            chatId: chat.id,
            senderId: userId,
            text,
          });

          socket
            .to(roomId)
            .emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log("Chat message save error", err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
