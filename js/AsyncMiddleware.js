import { Alert } from "react-native";

export default store => next => async action => {
  next(action);
  if (action.async) {
    const asyncOptions =
      typeof action.async === "function" ? action.async(store) : action.async;
    let promise = null;
    if (asyncOptions.dbRef) { // firestore
      promise = asyncOptions.dbRef[asyncOptions.dbMethod || "get"](
        ...(asyncOptions.args || [])
      );
    } else if (asyncOptions.func) { // function that returns promise
      promise = asyncOptions.func(...(asyncOptions.args || []));
    }
    try {
      const result = await promise;
      let data = null;
      if (typeof asyncOptions.data === "function") {
        data = asyncOptions.data(result);
      } else if (asyncOptions.data) {
        data = asyncOptions.data;
      } else {
        data = result;
      }
      next({
        type: `${action.type}/SUCCESS`,
        data
      });
      if (typeof asyncOptions.success === "function") {
        asyncOptions.success(result);
      } else if (typeof asyncOptions.success === "object") {
        next(asyncOptions.success);
      }
    } catch (error) {
      console.error(error);
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
    }
  }
};
