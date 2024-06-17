import { SET_INVITE, SET_MESSAGE } from "./actionTypes";

export const setInvite = (invites) => ({
  type: SET_INVITE,
  payload: invites,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: { message },
});
