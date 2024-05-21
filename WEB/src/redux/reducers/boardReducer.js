import { CREATE_BOARD } from "../actions/actionTypes";

const initialState = {
  boardId: null,
};

const boardReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_BOARD:
      return {
        ...state,
        boardId: payload ? payload.boardId : null,
      };
    default:
      return state;
  }
};

export default boardReducer;
