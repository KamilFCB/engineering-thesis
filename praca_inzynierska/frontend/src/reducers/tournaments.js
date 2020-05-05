import {
  GET_INCOMING_TOURNAMENTS,
  GET_HISTORY_TOURNAMENTS,
  JOIN_TOURNAMENT,
  LEAVE_TOURNAMENT,
} from "../actions/types";

const initialState = {
  isLoading: true,
  incomingTournaments: [],
  historyTournaments: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_INCOMING_TOURNAMENTS:
      return {
        ...state,
        isLoading: false,
        incomingTournaments: action.payload.tournaments,
        hasMore: action.payload.hasMore,
        nextPage: action.payload.nextPage,
        join: false,
        leave: false,
      };
    case GET_HISTORY_TOURNAMENTS:
      return {
        ...state,
        isLoading: false,
        historyTournaments: action.payload.tournaments,
        hasMore: action.payload.hasMore,
        nextPage: action.payload.nextPage,
        join: false,
        leave: false,
      };
    case JOIN_TOURNAMENT:
      return {
        ...state,
        updatedTournament: action.payload.tournament,
        join: true,
        leave: false,
      };
    case LEAVE_TOURNAMENT:
      return {
        ...state,
        updatedTournament: action.payload.tournament,
        join: false,
        leave: true,
      };
    default:
      return state;
  }
}
