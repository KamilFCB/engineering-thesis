import {
  GET_TOURNAMENT_PARTICIPANTS,
  GET_TOURNAMENT_INFORMATIONS,
  GET_TOURNAMENT_MATCHES,
  GET_TOURNAMENT_MATCH,
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
        ...state,
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
    default:
      return state;
  }
}
