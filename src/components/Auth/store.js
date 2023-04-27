import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";

import { sessionService } from "redux-react-session";

const initialState = {};
const middlewares = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middlewares))
);

const validateSession = (session) => {
  // check if your session is still valid
  return true;
};

const options = {
  redirectPath: "/",
  driver: "COOKIES",
  validateSession,
};

sessionService.initSessionService(store, options);

export default store;
