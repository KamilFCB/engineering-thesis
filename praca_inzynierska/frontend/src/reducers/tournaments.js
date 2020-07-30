import {
  GET_INCOMING_TOURNAMENTS,
  GET_HISTORY_TOURNAMENTS,
  JOIN_TOURNAMENT,
  LEAVE_TOURNAMENT,
  GET_ORGANIZED_TOURNAMENTS,
  GET_PLAYERS_RANKING,
} from "../actions/types";

const initialState = {
  isLoading: true,
  incomingTournaments: [],
  historyTournaments: [],
  organizedTournaments: [],
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
    case GET_ORGANIZED_TOURNAMENTS:
      return {
        ...state,
        isLoading: false,
        organizedTournaments: action.payload.tournaments,
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
    case GET_PLAYERS_RANKING:
      return {
        ranking: action.payload.ranking,
        startDate: action.payload.start_date,
        endDate: action.payload.end_date,
        isLoading: action.payload.is_loading,
      };
    default:
      return state;
  }
}
