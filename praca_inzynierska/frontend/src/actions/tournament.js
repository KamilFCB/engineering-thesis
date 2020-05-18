import axios from "axios";
import {
  GET_TOURNAMENT_PARTICIPANTS,
  GET_TOURNAMENT_INFORMATIONS,
  GET_TOURNAMENT_MATCHES,
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

export const getTournamentInformations = (tournamentId) => (
  dispatch,
  getState
) => {
  axios
    .get(`/api/tournament/${tournamentId}`)
    .then((res) => {
      dispatch({
        type: GET_TOURNAMENT_INFORMATIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentInformationsError: err.response.data.message,
        })
      );
    });
};

export const getTournamentMatches = (tournamentId) => (dispatch, getState) => {
  axios
    .get(`/api/tournament/${tournamentId}/matches`)
    .then((res) => {
      dispatch({
        type: GET_TOURNAMENT_MATCHES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentMatchesError: err.response.data.message,
        })
      );
    });
};
