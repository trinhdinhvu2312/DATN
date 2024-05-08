import { setLocalStorage } from "~/apis/agent";
import UserServices from "~/apis/UserServices";

import {
  LOGOUT,
  SET_MESSAGE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from "./actionTypes";
import { toast } from "react-toastify";

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
    const response = await UserServices.login(credentials);

    if (!response) {
      return;
    }

    if (response.status === 200) {
      toast.success(response.data.message);
      const accessToken = response.data.user.verifyToken;

      if (accessToken) {
        setLocalStorage("accessToken", accessToken);
        dispatch(loginSuccess(accessToken));
        navigate("/board");
      } else {
        navigate("/");
      }
    } else {
      toast.error(response.data.error);
    }
  } catch (error) {
    dispatch(loginFailure(error));
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.errMessage) ||
      error.errMessage ||
      error.toString();
    dispatch(setMessage(message));
  }
};

export const logout = (navigate) => (dispatch) => {
  dispatch(logOut());
  navigate("/");
};
