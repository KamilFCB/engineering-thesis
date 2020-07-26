import {
  GET_TOURNAMENT_PARTICIPANTS,
  GET_TOURNAMENT_INFORMATIONS,
  GET_TOURNAMENT_MATCHES,
  GET_TOURNAMENT_MATCH,
  GET_TOURNAMENT_ORGANIZER,
  START_TOURNAMENT,
  GET_PREV_MATCH_WINNER,
} from "../actions/types";

const initialState = {
  participants: null,
  isLoading: true,
  informations: null,
  matches: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TOURNAMENT_PARTICIPANTS:
      return {
        ...state,
        isLoading: false,
        participants: action.payload,
      };
    case GET_TOURNAMENT_INFORMATIONS:
      return {
        isLoading: false,
        informations: action.payload,
      };
    case GET_TOURNAMENT_MATCHES:
      return {
        ...state,
        isLoading: false,
        matches: action.payload,
      };
    case GET_TOURNAMENT_MATCH:
      return {
        isLoading: false,
        match: action.payload,
      };
    case GET_TOURNAMENT_ORGANIZER:
      return {
        isLoading: false,
        organizer: action.payload.organizer,
      };
    case START_TOURNAMENT:
      return {
        ...state,
        started: true,
      };
    case GET_PREV_MATCH_WINNER:
      return {
        prevMatchWinner: action.payload,
      };
    default:
      return state;
  }
}
