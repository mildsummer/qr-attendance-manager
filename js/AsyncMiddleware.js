import { Alert } from "react-native";
import { auth, functions } from "./firebase";
import { success, fail } from "./utils/actionTypeHelper";

const getAsync = asyncOptions => {
  if (asyncOptions.dbRef) {
    // firestore
    return asyncOptions.dbRef[asyncOptions.dbMethod || "get"](
      ...(asyncOptions.args || [])
    );
  } else if (asyncOptions.func) {
    if (asyncOptions.auth) {
      // firebase auth
      return auth[asyncOptions.func](...(asyncOptions.args || []));
    } else if (typeof asyncOptions.func === "string") {
      // firebase functions
      return functions.httpsCallable(asyncOptions.func)(
        ...(asyncOptions.args || [])
      );
    } else {
      return asyncOptions.func(...(asyncOptions.args || []));
    }
  } else {
    throw new Error("invalid async option");
  }
};

const createPayload = (result, asyncOptions) =>
  typeof asyncOptions.payload === "function"
    ? asyncOptions.payload(result)
    : asyncOptions.payload || result;

const alert = (alertOnResult, resultOrError) => {
  if (typeof alertOnResult === "function") {
    const args = alertOnResult(resultOrError);
    if (args && args.length) {
      Alert.alert(...args);
    }
  } else {
    Alert.alert(
      typeof alertOnResult === "string" ? alertOnResult : resultOrError.message
    );
  }
};

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    try {
      let result = await getAsync(asyncOptions);
      next({
        type: success(action.type),
        payload: createPayload(result, asyncOptions)
      });
      if (asyncOptions.alertOnSuccess) {
        alert(asyncOptions.alertOnSuccess, result);
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
        alert(asyncOptions.alertOnError, error);
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
