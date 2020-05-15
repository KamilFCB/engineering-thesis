import axios from "axios";

import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  GET_ERRORS,
} from "../actions/types";
import { createMessage } from "../actions/messages";

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  const config = setupToken(getState);

  axios
    .get("/api/auth/user", config)
    .then((res) => {
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const login = (username, password) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const bodyRequest = JSON.stringify({ username, password });

  axios
    .post("/api/auth/login", bodyRequest, config)
    .then((res) => {
      dispatch(createMessage({ loginSuccess: "Zalogowano pomyślnie" }));
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      const error = {
        message: err.response.data,
        status: err.response.status,
      };
      dispatch({
        type: GET_ERRORS,
        payload: error,
      });
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

export const logout = () => (dispatch, getState) => {
  const config = setupToken(getState);

  axios
    .post("/api/auth/logout", null, config)
    .then((res) => {
      dispatch(createMessage({ logoutSuccess: "Wylogowano pomyślnie" }));
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      const error = {
        message: err.response.data,
        status: err.response.status,
      };
      dispatch({
        type: GET_ERRORS,
        payload: error,
      });
    });
};

export const register = ({
  username,
  firstName,
  lastName,
  email,
  password,
}) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const bodyRequest = JSON.stringify({
    username,
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  });

  axios
    .post("/api/auth/register", bodyRequest, config)
    .then((res) => {
      dispatch(createMessage({ registerSuccess: "Pomyślnie utworzono konto" }));
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      const error = {
        message: err.response.data,
        status: err.response.status,
      };
      dispatch({
        type: GET_ERRORS,
        payload: error,
      });
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

export const setupToken = (state) => {
  const token = state().auth.token;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
