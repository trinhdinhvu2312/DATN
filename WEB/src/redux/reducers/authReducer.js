import { getLocalStorage } from "~/apis/agent";
import { LOGOUT, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actions/actionTypes";

const accessToken =
  getLocalStorage("accessToken") !== null
    ? getLocalStorage("accessToken")
    : null;

const initialState = accessToken
  ? { isLoggedIn: true, user: null }
  : { isLoggedIn: false, user: null };

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
