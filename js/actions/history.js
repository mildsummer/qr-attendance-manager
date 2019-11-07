import { db, functions } from "../utils/firebase";
import { Alert } from "react-native";

export const handleScanned = token => (dispatch, getState) => {
  const dbData = getState().user.data;
  dispatch({
    type: "SEND_HISTORY",
    token
  });
  functions
    .httpsCallable("createHistory")({
      token,
      guestName: dbData ? dbData.name : null
    })
    .then(result => {
      dispatch({
        type: "SEND_HISTORY_SUCCESS",
        data: result.data
      });
    })
    .catch(({ message }) => {
      Alert.alert(message);
      dispatch({
        type: "SEND_HISTORY_FAIL"
      });
    });
};

export const confirmHistory = () => dispatch => {
  dispatch({
    type: "CONFIRM_HISTORY"
  });
};

export const getHistory = (size, startAfter) => (dispatch, getState) => {
  const user = getState().auth.data;
  if (user) {
    let historyRef = db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size);
    if (startAfter) {
      historyRef = historyRef.startAfter(startAfter);
    }
    historyRef
      .get()
      .then(querySnapshot => {
        dispatch({
          type: "SUCCESS_GET_HISTORY",
          data: querySnapshot.docs,
          hasGetAll: querySnapshot.docs.length < size
        });
      })
      .catch(({ message }) => {
        Alert.alert(message);
      });
  }
};

export const refreshHistory = () => (dispatch, getState) => {
  const user = getState().auth.data;
  const history = getState().history.data;
  if (user) {
    let historyRef = db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc");
    if (history && history.length) {
      historyRef = historyRef.endBefore(history[0]);
    }
    historyRef
      .get()
      .then(querySnapshot => {
        dispatch({
          type: "REFRESH_HISTORY_SUCCESS",
          data: querySnapshot.docs
        });
      })
      .catch(({ message }) => {
        Alert.alert(message);
      });
  }
};
