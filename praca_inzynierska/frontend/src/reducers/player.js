import { GET_PLAYER_PROFILE } from "../actions/types";

const initialState = {
  profile: null,
  matches: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_PROFILE:
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
