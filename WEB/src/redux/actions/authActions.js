import { setLocalStorage } from "src/services/agent";
import LoginServices from "src/services/LoginServices";

import {
  LOGOUT,
  SET_MESSAGE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "./actionTypes";

export const loginSuccess = (accessToken) => ({
  type: LOGIN_SUCCESS,
  payload: { accessToken },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { error },
});

export const logOut = () => ({
  type: LOGOUT,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: { message },
});

export const login = (credentials, navigate) => async (dispatch) => {
  try {
    const response = await LoginServices.Login(credentials);

    const accessToken = response.data;

    if (accessToken !== undefined) {
      // Lưu token vào localStorage
      setLocalStorage("accessToken", accessToken);

      // Dispatch action loginSuccess để cập nhật state Redux với token mới
      dispatch(loginSuccess(accessToken));

      navigate("/");
    } else {
      navigate("/login");
    }
  } catch (error) {
    dispatch(loginFailure(error));
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    dispatch(setMessage(message));
  }
};

export const logout = (navigate) => (dispatch) => {
  dispatch(logOut());
  navigate("/");
};
