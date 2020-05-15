import axios from "axios";
import { setupToken } from "./auth";
import {
  USER_PROFILE_LOADING,
  USER_PROFILE_LOADED,
  TENNIS_PROFILE_LOADING,
  TENNIS_PROFILE_LOADED,
  GET_ERRORS,
} from "../actions/types";
import { createMessage } from "../actions/messages";

export const getUserProfile = () => (dispatch, getState) => {
  dispatch({ type: USER_PROFILE_LOADING });
  const config = setupToken(getState);

  axios
    .get("/api/user/profile", config)
    .then((res) => {
      dispatch({
        type: USER_PROFILE_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          profileLoadError: "Nie udało się załadować profilu, spróbuj ponownie",
        })
      );
    });
};

export const updateUserProfile = ({
  username,
  email,
  first_name,
  last_name,
}) => (dispatch, getState) => {
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    username,
    email,
    first_name,
    last_name,
  });
  axios
    .put("/api/user/profile", bodyRequest, config)
    .then((res) => {
      dispatch(
        createMessage({
          updateSuccess: "Profil został zaktualizowany",
        })
      );
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

export const getTennisProfile = () => (dispatch, getState) => {
  dispatch({ type: TENNIS_PROFILE_LOADING });
  const config = setupToken(getState);

  axios
    .get("/api/user/tennis_profile", config)
    .then((res) => {
      dispatch({
        type: TENNIS_PROFILE_LOADED,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          profileLoadError: "Nie udało się załadować profilu, spróbuj ponownie",
        })
      );
    });
};

export const updateTennisProfile = ({
  residence,
  birth_date,
  weight,
  height,
  forehand,
  backhand,
}) => (dispatch, getState) => {
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    residence,
    birth_date,
    weight,
    height,
    forehand,
    backhand,
  });
  axios
    .put("/api/user/tennis_profile", bodyRequest, config)
    .then((res) => {
      dispatch(
        createMessage({
          updateSuccess: "Profil tenisowy został zaktualizowany",
        })
      );
    })
    .catch((err) => {
      dispatch(
        createMessage({
          updateError: "Nie udało się zaktualizować profilu, spróbuj ponownie",
        })
      );
    });
};
