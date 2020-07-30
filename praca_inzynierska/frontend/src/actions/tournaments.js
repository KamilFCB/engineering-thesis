import axios from "axios";
import {
  GET_INCOMING_TOURNAMENTS,
  GET_HISTORY_TOURNAMENTS,
  JOIN_TOURNAMENT,
  LEAVE_TOURNAMENT,
  GET_ORGANIZED_TOURNAMENTS,
  GET_PLAYERS_RANKING,
} from "./types";
import { setupToken } from "./auth";
import { GET_ERRORS } from "./types";
import { createMessage } from "./messages";

export const createTournament = ({
  name,
  city,
  address,
  date,
  draw_size,
  description,
  end_of_registration,
}) => (dispatch, getState) => {
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    name,
    city,
    address,
    date,
    draw_size,
    description,
    end_of_registration,
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

export const getIncomingTournamentsPage = (pageNumber) => (
  dispatch,
  getState
) => {
  const config = setupToken(getState);
  axios
    .get(`/api/tournaments/incoming/page/${pageNumber}`, config)
    .then((res) => {
      dispatch({
        type: GET_INCOMING_TOURNAMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentsError:
            "Nie udało się pobrać listy turniejów, spróbuj ponownie za chwilę",
        })
      );
    });
};

export const getHistoryTournamentsPage = (pageNumber) => (
  dispatch,
  getState
) => {
  const config = setupToken(getState);
  axios
    .get(`/api/tournaments/history/page/${pageNumber}`, config)
    .then((res) => {
      dispatch({
        type: GET_HISTORY_TOURNAMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentsError:
            "Nie udało się pobrać listy turniejów, spróbuj ponownie za chwilę",
        })
      );
    });
};

export const joinTournament = (tournamentId) => (dispatch, getState) => {
  const config = setupToken(getState);
  const bodyRequest = JSON.stringify({
    tournament: tournamentId,
  });

  axios
    .post("/api/tournament/participate", bodyRequest, config)
    .then((res) => {
      dispatch({
        type: JOIN_TOURNAMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          joinTournamentsError: err.response.data.message,
        })
      );
    });
};

export const leaveTournament = (tournamentId) => (dispatch, getState) => {
  const token = getState().auth.token;
  axios
    .delete("/api/tournament/participate", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      data: {
        tournament: tournamentId,
      },
    })
    .then((res) => {
      dispatch({
        type: LEAVE_TOURNAMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          joinTournamentsError: err.response.data.message,
        })
      );
    });
};

export const getUserOrganizedTournaments = (userId) => (dispatch, getState) => {
  const config = setupToken(getState);
  axios
    .get(`/api/tournaments/organized/${userId}`, config)
    .then((res) => {
      dispatch({
        type: GET_ORGANIZED_TOURNAMENTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getTournamentsError:
            "Nie udało się pobrać listy turniejów, spróbuj ponownie za chwilę",
        })
      );
    });
};

export const getPlayersRanking = () => (dispatch, getState) => {
  axios
    .get("/api/ranking")
    .then((res) => {
      dispatch({
        type: GET_PLAYERS_RANKING,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch(
        createMessage({
          getRankingError:
            "Nie udało się pobrać rankingu, spróbuj ponownie za chwilę",
        })
      );
    });
};
