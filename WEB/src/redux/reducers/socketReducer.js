import { CONNECT_SOCKET, DISCONNECT_SOCKET } from "../actions/actionTypes";

const initialState = {
  socket: null,
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case DISCONNECT_SOCKET:
      return {
        ...state,
        socket: null,
      };
    default:
      return state;
  }
};

export default socketReducer;
