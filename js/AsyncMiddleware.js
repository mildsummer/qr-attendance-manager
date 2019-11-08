import { Alert } from "react-native";

export default store => next => action => {
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    let promise = null;
    if (asyncOptions.dbRef) {
      promise = asyncOptions.dbRef[asyncOptions.dbMethod || "get"](
        ...(asyncOptions.args || [])
      );
    } else if (asyncOptions.func) {
      promise = asyncOptions.func(...(asyncOptions.args || []));
    }
    promise
      .then((...results) => {
        let data = null;
        if (typeof asyncOptions.data === "function") {
          data = asyncOptions.data(...results);
        } else if (asyncOptions.data) {
          data = asyncOptions.data;
        } else if (results.length === 1) {
          data = results[0];
        } else if (results.length) {
          data = results;
        }
        next({
          type: `${action.type}/SUCCESS`,
          data
        });
        if (typeof asyncOptions.success === "function") {
          asyncOptions.success(...results);
        } else if (typeof asyncOptions.success === "object") {
          next(asyncOptions.success);
        }
      })
      .catch(error => {
        next({
          type: `${action.type}/FAIL`,
          error
        });
        if (asyncOptions.alertOnError) {
          Alert.alert(asyncOptions.alertOnError || error.message);
        }
        if (typeof asyncOptions.fail === "function") {
          asyncOptions.fail(error);
        } else if (typeof asyncOptions.fail === "object") {
          next(asyncOptions.fail);
        }
      });
  }
  next(action);
};
