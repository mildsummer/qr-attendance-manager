import { db } from "../firebase";
import { getNotificationPermission } from './common';

export const GET_USER = "GET_USER";
export const SEND_NAME = "SEND_NAME";
export const CHANGE_NAME = "CHANGE_NAME";
export const CREATE_TOKEN = "CREATE_TOKEN";

export const getUser = uid => ({
  type: GET_USER,
  async: {
    dbRef: db.collection("/users").doc(uid),
    dbMethod: "get",
    payload: documentSnapshot => documentSnapshot.data(),
    onSuccess: getNotificationPermission()
  }
});

export const changeName = name => ({
  type: CHANGE_NAME,
  payload: name
});

export const sendName = () => ({
  type: SEND_NAME,
  async: store => {
    const name = store.getState().user.name;
    return {
      dbRef: db.collection("/users").doc(store.getState().auth.data.uid),
      dbMethod: "set",
      args: [{ name }, { merge: true }],
      payload: name
    };
  }
});

export const createToken = () => ({
  type: CREATE_TOKEN,
  async: {
    func: "createToken",
    payload: token => token.data,
    alertOnError: "トークンの取得に失敗しました"
  }
});
