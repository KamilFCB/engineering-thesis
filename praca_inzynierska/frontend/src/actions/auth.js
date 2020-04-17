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
} from "../actions/types";

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
      //TODO
      console.log(err);
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
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      //TODO
      console.log(err);
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
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      //TODO
      console.log(err);
    });
};

export const register = ({ username, email, password }) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const bodyRequest = JSON.stringify({ username, email, password });

  axios
    .post("/api/auth/register", bodyRequest, config)
    .then((res) => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      //TODO
      console.log(err);
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
