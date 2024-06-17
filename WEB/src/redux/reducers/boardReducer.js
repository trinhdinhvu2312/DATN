import { CREATE_BOARD, SET_BOARD } from "../actions/actionTypes";

const initialState = {
  boardId: null,
  boards: [],
};

const boardReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BOARD:
      return {
        ...state,
        boardId: payload ? payload.boardId : null,
      };
    case SET_BOARD:
      return {
        ...state,
        boards: payload,
      };
    default:
      return state;
  }
};

export default boardReducer;
