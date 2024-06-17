import { SET_INVITE } from "../actions/actionTypes";

const initialState = {
  invites: [],
};

const inviteReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_INVITE:
      return {
        ...state,
        invites: payload,
      };
    default:
      return state;
  }
};

export default inviteReducer;
