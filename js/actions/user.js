import { db, functions } from "../firebase";

export const getUser = uid => ({
  type: "GET_USER",
  async: () => ({
    promise: db
      .collection("/users")
      .doc(uid)
      .get(),
    data: documentSnapshot => documentSnapshot.data()
  })
});

export const sendName = name => ({
  type: "SEND_NAME",
  async: store => ({
    promise: db
      .collection("/users")
      .doc(store.getState().auth.data.uid)
      .set({ name }, { merge: true }),
    data: name
  })
});

export const refreshToken = () => ({
  type: "CREATE_TOKEN",
  async: () => ({
    promise: functions.httpsCallable("createToken")(),
    data: token => token.data,
    alertOnError: "トークンの取得に失敗しました"
  })
});
