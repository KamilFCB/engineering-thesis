import axios from "axios";
import { TOURNAMENT_CREATE_SUCCESS } from "../actions/types";
import { setupToken } from "./auth";
import { GET_ERRORS } from "../actions/types";
import { createMessage } from "../actions/messages";

export const createTournament = ({
  name,
  city,
  address,
  date,
  draw_size,
  description,
}) => (dispatch, getState) => {
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    name,
    city,
    address,
    date,
    draw_size,
    description,
  });

  axios
    .post("/api/tournament/create", bodyRequest, config)
    .then((res) => {
      dispatch(createMessage({ tournamentCreateSuccess: res.data.message }));
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
