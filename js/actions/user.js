import { db, functions } from "../firebase";

export const GET_USER = "GET_USER";
export const SEND_NAME = "SEND_NAME";
export const CREATE_TOKEN = "CREATE_TOKEN";

export const getUser = uid => ({
  type: GET_USER,
  async: {
    dbRef: db.collection("/users").doc(uid),
    dbMethod: "get",
    data: documentSnapshot => documentSnapshot.data()
  }
});

export const sendName = name => ({
  type: SEND_NAME,
  async: store => ({
    dbRef: db.collection("/users").doc(store.getState().auth.data.uid),
    dbMethod: "set",
    args: [{ name }, { merge: true }],
    data: name
  })
});

export const createToken = () => ({
  type: CREATE_TOKEN,
  async: {
    func: functions.httpsCallable("createToken"),
    data: token => token.data,
    alertOnError: "トークンの取得に失敗しました"
  }
});
