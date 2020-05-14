import axios from "axios";
import {
  GET_TOURNAMENT_PARTICIPANTS,
} from "./types";
import { createMessage } from "./messages";

export const getTournamentParticipants = (tournamentId) => (
  dispatch,
  getState
) => {
  axios
    .get(`/api/tournament/participants/${tournamentId}`)
    .then((res) => {
      dispatch({
        type: GET_TOURNAMENT_PARTICIPANTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentParticipantsError: err.response.data.message,
        })
      );
    });
};
