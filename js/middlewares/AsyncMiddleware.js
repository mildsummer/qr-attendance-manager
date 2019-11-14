import { success, fail } from "../utils/actionTypeHelper";
import AsyncMiddlewareHelper from "./AsyncMiddlewareHelper";

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions = AsyncMiddlewareHelper.getAsyncOptions(action, store);
    try {
      let result = await AsyncMiddlewareHelper.getPromise(asyncOptions);
      next({
        type: success(action.type),
        payload: AsyncMiddlewareHelper.createPayload(result, asyncOptions)
      });
      if (asyncOptions.alertOnSuccess) {
        AsyncMiddlewareHelper.alert(asyncOptions.alertOnSuccess, result);
      }
      if (typeof asyncOptions.onSuccess === "function") {
        const onSuccessAction = asyncOptions.onSuccess(result);
        if (typeof onSuccessAction === "object") {
          AsyncMiddleware(store)(next)(onSuccessAction);
        }
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
        AsyncMiddlewareHelper.alert(asyncOptions.alertOnError, error);
      }
      if (typeof asyncOptions.onError === "function") {
        const onErrorAction = asyncOptions.onError(error);
        if (typeof onErrorAction === "object") {
          AsyncMiddleware(store)(next)(onErrorAction);
        }
      } else if (typeof asyncOptions.onError === "object") {
        AsyncMiddleware(store)(next)(asyncOptions.onError);
      }
    }
  }
};

export default AsyncMiddleware;
