import { SET_REMINDER } from "../actions/actionTypes";

const initialState = {
  reminders: [],
};

const reminderReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_REMINDER:
      return {
        ...state,
        reminders: payload,
      };
    default:
      return state;
  }
};

export default reminderReducer;
