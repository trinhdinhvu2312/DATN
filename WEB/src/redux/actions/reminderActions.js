import { SET_REMINDER, SET_MESSAGE } from "./actionTypes";

export const setReminder = (reminders) => ({
  type: SET_REMINDER,
  payload: reminders,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: { message },
});
