// actions/socketActions.js

import { CONNECT_SOCKET, DISCONNECT_SOCKET } from "./actionTypes";
import io from "socket.io-client";

let socket = null; // Global variable to hold the socket instance

export const connectSocket = () => (dispatch) => {
  const token = localStorage.getItem("accessToken");

  if (token && !socket) {
    socket = io("http://localhost:8017", {
      auth: { token: `Bearer ${token}` },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      dispatch({ type: CONNECT_SOCKET, payload: socket });
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      dispatch({ type: DISCONNECT_SOCKET });
      socket = null;
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
};

export const disconnectSocket = () => (dispatch) => {
  if (socket) {
    socket.disconnect();
    dispatch({ type: DISCONNECT_SOCKET });
    socket = null; // Reset socket instance
  }
};

// Function to get the current socket instance
export const getSocket = () => {
  return socket;
};

export const joinBoard = (boardId) => {
  if (socket) {
    socket.emit("joinBoard", boardId);
  } else {
    console.error("Socket is not initialized.");
  }
};

export const leaveBoard = (boardId) => {
  if (socket) {
    socket.emit("leaveBoard", boardId);
  } else {
    console.error("Socket is not initialized.");
  }
};

export const joinCardRoom = (cardId) => {
  if (socket) {
    socket.emit("joinCard", cardId);
  } else {
    console.error("Socket is not initialized.");
  }
};

export const leaveCardRoom = (cardId) => {
  if (socket) {
    socket.emit("leaveCard", cardId);
  } else {
    console.error("Socket is not initialized.");
  }
};
