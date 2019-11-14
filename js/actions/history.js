import { db } from "../firebase";
export const SEND_HISTORY = "SEND_HISTORY";
export const GET_HISTORY = "GET_HISTORY";
export const GET_HISTORY_BY_ID = "GET_HISTORY_BY_ID";
export const REFRESH_HISTORY = "REFRESH_HISTORY";
export const SUBMIT_COMMENT = "SUBMIT_COMMENT";

export const sendHistory = token => ({
  type: SEND_HISTORY,
  payload: token,
  async: store => {
    const dbData = store.getState().user.data;
    return {
      func: "createHistory",
      args: [
        {
          token,
          guestName: dbData ? dbData.name : null
        }
      ],
      payload: result => result.data,
      alertOnSuccess: result => [
        "読み取りに成功しました",
        `${result.data.hostName}(${result.data.email})`
      ],
      alertOnError: true
    };
  }
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
      historyRef = historyRef.startAfter(startAfter);
    }
    return {
      dbRef: historyRef,
      dbMethod: "get",
      payload: querySnapshot => ({
        docs: querySnapshot.docs,
        hasGetAll: querySnapshot.docs.length < size
      }),
      alertOnError: true
    };
  }
});

export const getHistoryById = historyId => ({
  type: GET_HISTORY_BY_ID,
  async: store => {
    const user = store.getState().auth.data;
    return {
      dbRef: db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .doc(historyId),
      dbMethod: "get",
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
      payload: querySnapshot => querySnapshot.docs,
      alertOnError: true
    };
  }
});

export const submitComment = (historyId, comment) => ({
  type: SUBMIT_COMMENT,
  async: {
    func: "submitComment",
    args: [{ historyId, comment }],
    alertOnError: true
  }
});
