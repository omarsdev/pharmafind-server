const socketIo = require("socket.io");
const {
  Users,
  Pharmacy,
  Pharmacist,
  Messages,
  Chats,
  sequelize,
} = require("../models");

const jwt = require("jsonwebtoken");

let userData = null;
let pharmacyData = null;

const users = new Map();
const userSockets = new Map();

const pharmacy = new Map();
const pharmacySockets = new Map();

const SocketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token._W, process.env.JWT_SECRET);
      if (decoded.type === "user") {
        userData = await Users.findByPk(decoded.id);
        if (userData) {
          next();
        }
      } else if (decoded.type === "pharmacist") {
        pharmacyData = await Pharmacist.findByPk(decoded.id, {
          include: {
            model: Pharmacy,
          },
        });
        if (pharmacyData) {
          next();
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", async (type) => {
      try {
        let sockets = [];

        if (type === "user") {
          if (users.has(userData.id)) {
            const existingUser = users.get(userData.id);
            existingUser.sockets = [...existingUser.sockets, ...[socket.id]];
            users.set(userData.id, existingUser);
            sockets = [...existingUser.sockets, ...[socket.id]];
            userSockets.set(socket.id, userData.id);
          } else {
            users.set(userData.id, {
              id: userData.id,
              sockets: [socket.id],
            });
            sockets.push(socket.id);
            userSockets.set(socket.id, userData.id);
          }
        } else if (type === "pharmacy") {
          if (pharmacy.has(pharmacyData.id)) {
            const existingPharmacy = pharmacy.get(pharmacyData.id);
            existingPharmacy.sockets = [
              ...existingPharmacy.sockets,
              ...[socket.id],
            ];
            pharmacy.set(pharmacyData.id, existingPharmacy);
            sockets = [...existingPharmacy.sockets, ...[socket.id]];
            pharmacySockets.set(socket.id, pharmacyData.id);
          } else {
            pharmacy.set(pharmacyData.id, {
              id: pharmacyData.id,
              sockets: [socket.id],
            });
            sockets.push(socket.id);
            pharmacySockets.set(socket.id, pharmacyData.id);
          }

          // const getAllChatWithUser = await getChattersWithUser();

          // io.emit("join", getAllChatWithUser);
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      console.log("user is disconnected");
      const token = socket.handshake.auth.token;
      try {
        const decoded = await jwt.verify(token._W, process.env.JWT_SECRET);
        if (decoded.type === "user") {
          if (userSockets.has(socket.id)) {
            const user = users.get(userSockets.get(socket.id));
            user.sockets = user.sockets.filter((sock) => {
              if (sock !== socket.id) return true;
              userSockets.delete(sock);
              return false;
            });
            users.set(user.id, user);
          }
        } else {
          if (pharmacySockets.has(socket.id)) {
            const pharma = pharmacy.get(pharmacySockets.get(socket.id));
            pharma.sockets = pharma.sockets.filter((sock) => {
              if (sock !== socket.id) return true;
              pharmacySockets.delete(sock);
              return false;
            });
            pharmacy.set(pharma.id, pharma);
          }
        }
      } catch (error) {
        console.log(error);
      }

      // if (userSockets.has(socket.id)) {
      //   const user = users.get(userSockets.get(socket.id));

      //   if (user.sockets.length > 1) {
      //     user.sockets = user.sockets.filter((sock) => {
      //       if (sock !== socket.id) return true;

      //       userSockets.delete(sock);
      //       return false;
      //     });

      //     users.set(user.id, user);
      //   } else {
      //     const chatters = await getChatters(user.id);

      //     for (let i = 0; i < chatters.length; i++) {
      //       if (users.has(chatters[i])) {
      //         users.get(chatters[i]).sockets.forEach((socket) => {
      //           try {
      //             io.to(socket).emit("offline", user);
      //           } catch (e) {}
      //         });
      //       }
      //     }

      //     userSockets.delete(socket.id);
      //     users.delete(user.id);
      //   }
      // }
    });

    socket.on("pharmacy-message", async (msg) => {
      const token = socket.handshake.auth.token;
      try {
        const decoded = await jwt.verify(token._W, process.env.JWT_SECRET);
        if (decoded.type === "pharmacist") {
          let chatId;

          const findChat = await Chats.findOne({
            where: { userId: msg.userId, pharmacyId: decoded.id },
          });

          if (!findChat) {
            const createChat = await Chats.create({
              userId: msg.userId,
              pharmacyId: decoded.id,
            });

            const chat = await Chats.findOne({
              where: { userId: msg.userId, pharmacyId: decoded.id },
              attributes: ["id"],
            });

            chatId = chat.id;
          } else {
            chatId = findChat.id;
          }

          const message = await Messages.create({
            chatId: chatId,
            message: msg.text,
            fromPharmacyId: decoded.id,
          });

          const getTheChatWithPharmacy = await getAllChatWithPharmacy(
            decoded.id,
            msg.userId
          );

          users?.get(msg.userId)?.sockets?.map((e) => {
            if (userSockets.has(e)) {
              io.to(e).emit("receive-pharmacy-message", getTheChatWithPharmacy);
            }
          });
        }
      } catch (err) {}
    });

    socket.on("user-message", async (msg) => {
      const token = socket.handshake.auth.token;
      try {
        const decoded = await jwt.verify(token._W, process.env.JWT_SECRET);
        if (decoded.type === "user") {
          let chatId;

          const findChat = await Chats.findOne({
            where: { userId: decoded.id, pharmacyId: msg.pharmacyId },
          });

          if (!findChat) {
            const createChat = await Chats.create({
              userId: decoded.id,
              pharmacyId: msg.pharmacyId,
            });

            const chat = await Chats.findOne({
              where: { userId: decoded.id, pharmacyId: msg.pharmacyId },
              attributes: ["id"],
            });

            chatId = chat.id;
          } else {
            chatId = findChat.id;
          }

          const message = await Messages.create({
            chatId: chatId,
            message: msg.text,
            fromUserId: decoded.id,
          });

          const getAllChatWithUser = await getChattersWithUser(
            decoded.id,
            msg.pharmacyId
          );

          pharmacy?.get(msg.pharmacyId)?.sockets?.map((e) => {
            if (pharmacySockets.has(e)) {
              io.to(e).emit("receive-user-message", getAllChatWithUser);
              // io.to(e).emit("join", getAllChatWithUser);
            }
          });
        }
      } catch (error) {}
    });

    socket.on("pharmacy-online-offline", async (onlineOffline) => {
      const token = socket.handshake.auth.token;
      try {
        const decoded = await jwt.verify(token._W, process.env.JWT_SECRET);
        if (decoded.type === "pharmacist") {
          const allUser = await Users.findAll({
            attributes: ["id"],
          });

          allUser.forEach((e) => {
            // console.log(id.id);
            // console.log(users);
            users.get(e.id).sockets.map((e) => {
              if (userSockets.has(e)) {
                io.to(e).emit("pharmacy-online-offline", onlineOffline);
              }
            });
          });
        }
      } catch (err) {}
    });
  });
};

module.exports = SocketServer;

const getChattersWithUser = async (userId, pharmacyId) => {
  return await Chats.findOne({
    where: { pharmacyId: pharmacyId, userId: userId },

    include: [
      {
        model: Users,
        attributes: ["id", "name"],
      },
      {
        model: Messages,
        attributes: ["id", "message", "createdAt", "fromUserId"],
        order: [["createdAt", "DESC"]],
        limit: 1,
      },
    ],
    attributes: ["id"],
  });
};

const getAllChatWithPharmacy = async (pharmacyId, userId) => {
  return await Chats.findOne({
    where: { pharmacyId: pharmacyId, userId: userId },

    include: [
      {
        model: Pharmacy,
        attributes: ["id", "name", "photo"],
      },
      {
        model: Messages,
        order: [["createdAt", "DESC"]],
        limit: 1,
      },
    ],
    attributes: ["id"],
  });
};
