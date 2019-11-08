import { db, functions } from "../firebase";

export const handleScanned = (token) => ({
  type: "SEND_HISTORY",
  data: token,
  async: (store) => {
    const dbData = store.getState().user.data;
    return {
      promise: functions.httpsCallable("createHistory")({
        token,
        guestName: dbData ? dbData.name : null
      }),
      data: (result) => (result.data),
      alertOnError: true
    };
  }
});

export const confirmHistory = () => ({
  type: "CONFIRM_HISTORY"
});

export const getHistory = (size, startAfter) => ({
  type: "GET_HISTORY",
  async: (store) => {
    const user = store.getState().auth.data;
    let historyRef = db.collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size);
    if (startAfter) {
      historyRef = historyRef.startAfter(startAfter);
    }
    return {
      promise: historyRef.get(),
      data: (querySnapshot) => ({
        docs: querySnapshot.docs,
        hasGetAll: querySnapshot.docs.length < size
      }),
      alertOnError: true
    };
  }
});

export const refreshHistory = () => ({
  type: "REFRESH_HISTORY",
  async: (store) => {
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
      promise: historyRef.get(),
      data: (querySnapshot) => (querySnapshot.docs),
      alertOnError: true
    }
  }
});
