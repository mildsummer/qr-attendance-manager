import { Alert } from "react-native";
import { auth, functions } from "./firebase";
import { success, fail } from "./utils/actionTypeHelper";

const AsyncMiddleware = store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    let result = null;
    try {
      if (asyncOptions.dbRef) {
        // firestore
        result = await asyncOptions.dbRef[asyncOptions.dbMethod || "get"](
          ...(asyncOptions.args || [])
        );
      } else if (asyncOptions.func) {
        if (asyncOptions.auth) {
          // firebase auth
          result = await auth[asyncOptions.func](...(asyncOptions.args || []));
        } else {
          // firebase functions
          result = await functions.httpsCallable(asyncOptions.func)(
            ...(asyncOptions.args || [])
          );
        }
      }
      let data = null;
      if (typeof asyncOptions.data === "function") {
        data = asyncOptions.data(result);
      } else if (asyncOptions.data) {
        data = asyncOptions.data;
      } else {
        data = result;
      }
      next({
        type: success(action.type),
        data
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
