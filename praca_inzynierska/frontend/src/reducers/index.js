import { combineReducers } from "redux";
import auth from "./auth";
import errors from "./errors";
import messages from "./messages";
import profile from "./profile";

export default combineReducers({
  errors,
  auth,
  messages,
  profile,
});
