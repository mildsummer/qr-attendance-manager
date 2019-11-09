import { success, fail } from "../utils/actionTypeHelper";
import {
  getPromise,
  createPayload,
  alertResult
} from "./AsyncMiddlewareHelpers";

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    try {
      let result = await getPromise(asyncOptions);
      next({
        type: success(action.type),
        payload: createPayload(result, asyncOptions)
      });
      if (asyncOptions.alertOnSuccess) {
        alertResult(asyncOptions.alertOnSuccess, result);
      }
      if (typeof asyncOptions.onSuccess === "function") {
        asyncOptions.onSuccess(result);
      } else if (typeof asyncOptions.onSuccess === "object") {
        AsyncMiddleware(store)(next)(asyncOptions.onSuccess);
      }
    } catch (error) {
      console.warn(error);
      next({
        type: fail(action.type),
        error
      });
      if (asyncOptions.alertOnError) {
        alertResult(asyncOptions.alertOnError, error);
      }
      if (typeof asyncOptions.onError === "function") {
        asyncOptions.onError(error);
      } else if (typeof asyncOptions.onError === "object") {
        AsyncMiddleware(store)(next)(asyncOptions.onError);
      }
    }
  }
};

export default AsyncMiddleware;
