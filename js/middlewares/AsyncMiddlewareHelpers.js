import { auth, functions } from "../firebase";
import { Alert } from "react-native";

export default {
  getAsyncOptions: (action, store) =>
    typeof action.async === "function" ? action.async(store) : action.async,
  getPromise: asyncOptions => {
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
  },
  createPayload: (result, asyncOptions) =>
    typeof asyncOptions.payload === "function"
      ? asyncOptions.payload(result)
      : asyncOptions.payload || result,
  alert: (alertOnResult, resultOrError) => {
    if (typeof alertOnResult === "function") {
      const args = alertOnResult(resultOrError);
      if (args && args.length) {
        Alert.alert(...args);
      }
    } else if (typeof alertOnResult === "string") {
      Alert.alert(alertOnResult);
    } else if (Array.isArray(alertOnResult)) {
      Alert.alert(...alertOnResult);
    } else {
      Alert.alert(resultOrError.message);
    }
  }
};
