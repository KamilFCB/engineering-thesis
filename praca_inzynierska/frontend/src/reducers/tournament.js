import {
  GET_TOURNAMENT_PARTICIPANTS,
  GET_TOURNAMENT_INFORMATIONS,
} from "../actions/types";

const initialState = {
  participants: null,
  isLoading: true,
  informations: null,
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
    default:
      return state;
  }
}
