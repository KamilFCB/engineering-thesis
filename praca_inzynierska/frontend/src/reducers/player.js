import { GET_PLAYER_PROFILE, GET_PLAYER_MATCHES } from "../actions/types";

const initialState = {
  profile: null,
  matches: null,
  isLoadingProfile: true,
  isLoadingMatches: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_PLAYER_PROFILE:
      return {
        ...state,
        profile: action.payload,
        isLoadingProfile: false,
      };
    case GET_PLAYER_MATCHES:
      return {
        ...state,
        matches: action.payload.matches,
        isLoadingMatches: false,
        hasMore: action.payload.hasMore,
        nextPage: action.payload.nextPage,
      };
    default:
      return state;
  }
}
