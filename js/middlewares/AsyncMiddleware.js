import { success, fail } from "../utils/actionTypeHelper";
import AsyncMiddlewareHelpers from "./AsyncMiddlewareHelpers";

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions = AsyncMiddlewareHelpers.getAsyncOptions(action, store);
    try {
      let result = await AsyncMiddlewareHelpers.getPromise(asyncOptions);
      next({
        type: success(action.type),
        payload: AsyncMiddlewareHelpers.createPayload(result, asyncOptions)
      });
      if (asyncOptions.alertOnSuccess) {
        AsyncMiddlewareHelpers.alert(asyncOptions.alertOnSuccess, result);
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
        AsyncMiddlewareHelpers.alert(asyncOptions.alertOnError, error);
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
