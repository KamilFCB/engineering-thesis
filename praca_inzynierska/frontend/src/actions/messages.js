import { CREATE_MESSAGE } from "../actions/types";

export const createMessage = (message) => {
  return {
    type: CREATE_MESSAGE,
    payload: message,
  };
};
