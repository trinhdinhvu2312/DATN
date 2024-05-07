import { getLocalStorage } from "../../services/agent";
import { LOGOUT, LOGIN_SUCCESS, LOGIN_FAILURE } from "../actions/actionTypes";

const accessToken =
  getLocalStorage("accessToken") !== null
    ? getLocalStorage("accessToken")
    : null;

const initialState = accessToken
  ? { isLoggedIn: true, accessToken }
  : { isLoggedIn: false, accessToken: null };

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        accessToken: payload.accessToken,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        accessToken: null,
      };
    default:
      return state;
  }
};

export default authReducer;
