import socketio from "socket.io";
import jwt from "jsonwebtoken";

import { userModel } from "~/models/userModel";
import { support } from "./support";
import { boardService } from "~/services/boardService";

const authHandler = async (socket, next) => {
  const { token = null } = socket.handshake.auth;
  if (!token) {
    return next(new Error("no token"));
  }

  const [authType, tokenValue] = token.trim().split(" ");

  if (authType !== "Bearer" || !tokenValue) {
    return next(new Error("invalid token format"));
  }

  try {
    const verifiedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);

    const user = await userModel.findOneById(verifiedToken.id);
    if (!user) {
      return next(new Error("no user found"));
    }
    const boards = await boardService.getAll(verifiedToken.id);
    const boardIds = boards.map((board) => board._id.toString());
    const u = {
      id: verifiedToken.id,
      name: user.username,
      isActive: user.isActive,
      socketId: socket.id,
      boardIds,
    };

    const existingUser = support.findUserById(verifiedToken.id);

    if (!existingUser) {
      support.users.push(u);
    } else {
      existingUser.socketId = socket.id;
    }

    next();
  } catch (err) {
    next(new Error("invalid token"));
  }
};

const socket = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(authHandler);

  const onConnection = async (socket) => {
    try {
      await support.supportHandler(io, socket);
      await support.scheduleAllReminders(io);
    } catch (error) {
      console.error("Error in supportHandler:", error);
      socket.emit("error", "An error occurred while processing your request.");
    }
  };

  io.on("connection", onConnection);
};

export default socket;
