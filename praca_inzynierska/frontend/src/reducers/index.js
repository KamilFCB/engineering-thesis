import { combineReducers } from "redux";
import auth from "./auth";
import errors from "./errors";
import messages from "./messages";
import profile from "./profile";
import tournaments from "./tournaments";
import tournament from "./tournament";

export default combineReducers({
  errors,
  auth,
  messages,
  profile,
  tournaments,
  tournament,
});
