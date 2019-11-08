import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";

import AsyncMiddleware from "./AsyncMiddleware";
import NavigateMiddleware from "./NavigateMiddleware";
import * as reducers from "./reducers/index";

export default createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, AsyncMiddleware, NavigateMiddleware)
);
