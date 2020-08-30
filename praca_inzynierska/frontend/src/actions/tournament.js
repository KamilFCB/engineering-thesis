import axios from "axios";
import {
  GET_TOURNAMENT_PARTICIPANTS,
  GET_TOURNAMENT_INFORMATIONS,
  GET_TOURNAMENT_MATCHES,
  GET_TOURNAMENT_MATCH,
  GET_TOURNAMENT_ORGANIZER,
  START_TOURNAMENT,
  GET_PREV_MATCH_WINNER,
} from "./types";
import { createMessage } from "./messages";
import { setupToken } from "./auth";

export const getTournamentParticipants = (tournamentId) => (
  dispatch,
  getState
) => {
  /**
   * Get list of tournament participants
   */
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
  /**
   * Get informations about tournamnet
   */
  const config = setupToken(getState);
  axios
    .get(`/api/tournament/${tournamentId}`, config)
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
  /**
   * Get list of tournament matches
   */
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

export const getTournamentMatch = (matchId) => (dispatch, getState) => {
  /**
   * Get informations about tennis match
   */
  axios
    .get(`/api/tournament/match/${matchId}`)
    .then((res) => {
      dispatch({
        type: GET_TOURNAMENT_MATCH,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentMatchError: err.response.data.message,
        })
      );
    });
};

export const getTournamentOrganizer = (tournamentId) => (
  dispatch,
  getState
) => {
  /**
   * Get tournament organizer
   */
  axios
    .get(`/api/tournament/${tournamentId}/organizer`)
    .then((res) => {
      dispatch({
        type: GET_TOURNAMENT_ORGANIZER,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getOrganizerError: err.response.data.message,
        })
      );
    });
};

export const startTournament = (tournamentId) => (dispatch, getState) => {
  /**
   * Start tournament and draw a tournament bracket
   */
  const config = setupToken(getState);
  axios
    .get(`/api/tournament/${tournamentId}/start`, config)
    .then((res) => {
      dispatch({
        type: START_TOURNAMENT,
        payload: {},
      });
      dispatch(
        createMessage({
          startTournamentSuccess: "Turniej został rozpoczęty",
        })
      );
    })
    .catch((err) => {
      dispatch(
        createMessage({
          startTournamentError: err.response.data.message,
        })
      );
    });
};

export const prevMatchWinner = (match, player) => (dispatch, getState) => {
  /**
   * Get winner of previous match
   */
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    match,
    player,
  });

  axios
    .post(`/api/tournament/match/possible_player`, bodyRequest, config)
    .then((res) => {
      dispatch({
        type: GET_PREV_MATCH_WINNER,
        payload: {
          playerNumber: res.data.player_number,
          player: res.data.player,
        },
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          startTournamentError: err.response.data.message,
        })
      );
    });
};

export const updateMatch = ({ matchId, player1, player2, score, time }) => (
  dispatch,
  getState
) => {
  /**
   * Update match informations
   */
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    player1,
    player2,
    score,
    time,
  });

  axios
    .put(`/api/tournament/match/${matchId}`, bodyRequest, config)
    .then((res) => {
      dispatch(
        createMessage({
          updateSuccess: "Mecz został zaktualizowany",
        })
      );
    })
    .catch((err) => {
      if (err.response.data.message) {
        dispatch(
          createMessage({
            matchUpdateError: err.response.data.message,
          })
        );
      }
      if (err.response.data.non_field_errors) {
        dispatch(
          createMessage({
            matchUpdateError: err.response.data.non_field_errors[0],
          })
        );
      }
    });
};
