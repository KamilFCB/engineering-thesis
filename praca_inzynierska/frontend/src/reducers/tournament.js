import {
  GET_TOURNAMENT_PARTICIPANTS,
} from "../actions/types";

const initialState = {
  participants: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_TOURNAMENT_PARTICIPANTS:
      return {
        ...state,
        isLoading: false,
        participants: action.payload,
      };
    default:
      return state;
  }
}
