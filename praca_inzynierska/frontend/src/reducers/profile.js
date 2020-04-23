import {
  TENNIS_PROFILE_LOADING,
  TENNIS_PROFILE_LOADED,
  USER_PROFILE_LOADING,
  USER_PROFILE_LOADED,
} from "../actions/types";

const initialState = {
  userProfile: null,
  tennisProfile: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE_LOADING:
    case TENNIS_PROFILE_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_PROFILE_LOADED:
      return {
        ...state,
        userProfile: action.payload,
        isLoading: false,
      };
    case TENNIS_PROFILE_LOADED:
      return {
        ...state,
        tennisProfile: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}
