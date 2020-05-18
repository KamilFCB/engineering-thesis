import axios from "axios";
import { GET_PLAYER_PROFILE } from "../actions/types";

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
