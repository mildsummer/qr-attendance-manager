import { db, functions } from "../firebase";

export const SEND_HISTORY = "SEND_HISTORY";
export const CONFIRM_HISTORY = "CONFIRM_HISTORY";
export const GET_HISTORY = "GET_HISTORY";
export const REFRESH_HISTORY = "REFRESH_HISTORY";

export const sendHistory = token => ({
  type: SEND_HISTORY,
  data: token,
  async: store => {
    const dbData = store.getState().user.data;
    return {
      func: functions.httpsCallable("createHistory"),
      args: [
        {
          token,
          guestName: dbData ? dbData.name : null
        }
      ],
      data: result => result.data,
      alertOnError: true
    };
  }
});

export const confirmHistory = () => ({
  type: CONFIRM_HISTORY
});

export const getHistory = (size, startAfter) => ({
  type: GET_HISTORY,
  async: store => {
    const user = store.getState().auth.data;
    let historyRef = db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size);
    if (startAfter) {
      console.log(historyRef);
      historyRef = historyRef.startAfter(startAfter);
    }
    return {
      dbRef: historyRef,
      dbMethod: "get",
      data: querySnapshot => ({
        docs: querySnapshot.docs,
        hasGetAll: querySnapshot.docs.length < size
      }),
      alertOnError: true
    };
  }
});

export const refreshHistory = () => ({
  type: REFRESH_HISTORY,
  async: store => {
    const user = store.getState().auth.data;
    const history = store.getState().history.data;
    let historyRef = db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc");
    if (history && history.length) {
      historyRef = historyRef.endBefore(history[0]);
    }
    return {
      dbRef: historyRef,
      dbMethod: "get",
      data: querySnapshot => querySnapshot.docs,
      alertOnError: true
    };
  }
});
