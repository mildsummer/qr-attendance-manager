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
    } else {
      // firebase functions
      return functions.httpsCallable(asyncOptions.func)(
        ...(asyncOptions.args || [])
      );
    }
  } else {
    throw new Error("invalid async option");
  }
};

const createData = (result, asyncOptions) =>
  typeof asyncOptions.data === "function"
    ? asyncOptions.data(result)
    : asyncOptions.data || result;

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    try {
      let result = await getAsync(asyncOptions);
      next({
        type: success(action.type),
        data: createData(result, asyncOptions)
      });
      if (asyncOptions.alertOnSuccess) {
        Alert.alert(asyncOptions.alertOnSuccess);
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
        Alert.alert(asyncOptions.alertOnError || error.message);
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
