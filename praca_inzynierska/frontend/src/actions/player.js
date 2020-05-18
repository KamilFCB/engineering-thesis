import axios from "axios";
import { GET_PLAYER_PROFILE, GET_PLAYER_MATCHES } from "../actions/types";
import { createMessage } from "./messages";

export const getPlayerInformations = (playerId) => (dispatch, getState) => {
  axios
    .get(`/api/player/${playerId}/informations`)
    .then((res) => {
      dispatch({
        type: GET_PLAYER_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          profileLoadError: err.response.data.message,
        })
      );
    });
};

export const getPlayerMatches = (playerId) => (dispatch, getState) => {
  axios
    .get(`/api/player/${playerId}/matches`)
    .then((res) => {
      dispatch({
        type: GET_PLAYER_MATCHES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          profileLoadError: err.response.data.message,
        })
      );
    });
};
