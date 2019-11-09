import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import AsyncMiddleware from "./middlewares/AsyncMiddleware";
import NavigateMiddleware from "./middlewares/NavigateMiddleware";
import * as reducers from "./reducers/index";

export default createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, AsyncMiddleware, NavigateMiddleware)
);
