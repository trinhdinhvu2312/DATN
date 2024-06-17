import { CREATE_BOARD, SET_BOARD, SET_MESSAGE } from "./actionTypes";

export const createBoard = (boardId) => ({
  type: CREATE_BOARD,
  payload: { boardId },
});

export const setBoard = (boards) => ({
  type: SET_BOARD,
  payload: boards,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: { message },
});
