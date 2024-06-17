import { reminderModel } from "~/models/reminderModel";
import { reminderService } from "~/services/reminderService";
import { REMINDER_TYPES } from "~/utils/constants";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import { cardModel } from "~/models/cardModel";

const users = [];

const findUserById = (id) => users.find((x) => x.id === id);
const findUserBySocketId = (socketId) =>
  users.find((x) => x.socketId === socketId);

const updatedUserStatus = (user, status) => {
  const existingUser = findUserById(user.id);
  if (existingUser) {
    existingUser.isActive = status;
  }
};

const scheduleIndividualReminder = (reminder, io) => {
  const now = new Date();
  const dueDate = new Date(reminder.dueDate);
  const timeDiff = dueDate - now;

  if (timeDiff > 0) {
    setTimeout(() => {
      if (reminder.type === REMINDER_TYPES.PUBLIC) {
        io.to(reminder.boardId).emit("reminder", reminder);
        io.emit("getAllReminder");
      } else {
        const user = users.find((user) => user.id === reminder.userId);
        if (user && user.socketId) {
          io.to(user.socketId).emit("reminder", reminder);
        }
      }
    }, timeDiff);
  }
};

// Function to schedule all reminders for a user
const scheduleReminders = async (userId, io) => {
  const now = new Date();
  const reminders = await reminderModel.scheduleReminders(userId, now);
  reminders.forEach((reminder) => scheduleIndividualReminder(reminder, io));
};

const scheduleAllReminders = async (io) => {
  for (const user of users) {
    if (user.isActive) {
      await scheduleReminders(user.id, io);
    }
  }
};
cron.schedule("* * * * *", async (io) => {
  await scheduleAllReminders(io);
});

const supportHandler = (io, socket) => {
  const { token = null } = socket.handshake.auth;
  const [authType, tokenValue] = token.trim().split(" ");
  const verifiedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);

  socket.on("joinBoard", (boardId) => {
    socket.join(boardId);
  });

  socket.on("leaveBoard", (boardId) => {
    socket.leave(boardId);
  });

  socket.on("createReminder", async (reminderData) => {
    try {
      const newReminder = await reminderService.createNewReminder(
        verifiedToken.id,
        reminderData
      );

      if (reminderData.type === REMINDER_TYPES.PUBLIC) {
        io.emit("newReminder", newReminder);
        io.emit("getAllReminder");
      } else {
        const user = users.find((user) => user.id === verifiedToken.id);
        if (user && user.socketId) {
          io.to(user.socketId).emit("newReminder", newReminder);
        }
      }
      scheduleIndividualReminder(newReminder, io);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("connect", () => {
    const user = findUserBySocketId(socket.id);
    if (user) {
      updatedUserStatus(user, true);
      scheduleReminders(socket, io);
    }
  });

  socket.on("joinCard", (cardId) => {
    socket.join(cardId);
  });

  socket.on("leaveCard", (cardId) => {
    socket.leave(cardId);
  });

  socket.on("newCard", (cardData) => {
    try {
      io.to(cardData._id).emit("newCard", cardData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("newInvite", (inviteData) => {
    try {
      const user = users.find((user) => user.id === inviteData.inviteeId);
      if (user && user.socketId) {
        io.to(user.socketId).emit("newInvite", inviteData);
      }
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("newComment", (commentData) => {
    try {
      io.to(commentData.cardId).emit("newComment", commentData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("newAttachment", (attachmentData) => {
    try {
      io.to(attachmentData.cardId).emit("newAttachment", attachmentData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("deleteComment", () => {
    try {
      io.emit("deleteComment");
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("deleteAttachment", () => {
    try {
      io.emit("deleteAttachment");
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("connect", async () => {
    const user = findUserBySocketId(socket.id);
    if (user) {
      updatedUserStatus(user, true);
      scheduleReminders(user.id, io);
    }
  });

  socket.on("disconnect", async () => {
    const user = findUserBySocketId(socket.id);
    if (user) {
      updatedUserStatus(user, false);
      user.isActive = false;
      socket.broadcast.emit("disconnectUser", user);
    }
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => socket.leave(room));
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
};
export const support = {
  supportHandler,
  users,
  findUserById,
  findUserBySocketId,
  updatedUserStatus,
  scheduleAllReminders,
};
