import { auth, db, functions } from "../utils/firebase";
import { Alert } from "react-native";
import { Linking } from "expo";
import { FIREBASE_AUTH_DOMAIN } from "react-native-dotenv";

export const authUser = (email, password) => dispatch => {
  dispatch({
    type: "START_AUTH_USER"
  });
  auth.createUserWithEmailAndPassword(email, password).catch(({ message }) => {
    Alert.alert("認証に失敗しました", message);
    dispatch({
      type: "FAIL_AUTH_USER",
      message
    });
  });
};

export const signIn = (email, password) => dispatch => {
  dispatch({
    type: "START_AUTH_USER"
  });
  auth.signInWithEmailAndPassword(email, password).catch(() => {
    authUser(email, password)(dispatch);
  });
};

export const sendPasswordResetEmail = email => () => {
  return auth.sendPasswordResetEmail(email);
};

export const verifyEmail = () => (dispatch, getState) => {
  const user = getState().auth.data;
  if (user) {
    Alert.alert(
      "Email verification",
      "We will send a verification link to your email account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            user
              .sendEmailVerification({
                url: Linking.makeUrl(FIREBASE_AUTH_DOMAIN)
              })
              .then(() => {
                Alert.alert("The email has been sent.");
                db.collection("/users")
                  .doc(user.uid)
                  .onSnapshot(docSnapshot => {
                    const dbUser = docSnapshot.data();
                    if (dbUser && dbUser.emailVerifiedAt) {
                      Alert.alert("Email verification has succeeded.");
                      dispatch({
                        type: "SUCCESS_GET_USER",
                        data: dbUser
                      });
                      user.reload().then(() => {
                        console.log(user);
                      });
                    }
                  });
              })
              .catch(function({ message }) {
                Alert.alert(message);
              });
          }
        }
      ]
    );
  }
};

export const sendName = name => (dispatch, getState) => {
  const user = getState().auth.data;
  return db
    .collection("/users")
    .doc(user.uid)
    .set({ name }, { merge: true })
    .then(() => {
      dispatch({
        type: "SUCCESS_SEND_NAME",
        name
      });
      return true;
    });
};

export const handleScanned = token => (dispatch, getState) => {
  const dbData = getState().auth.dbData;
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
  const history = getState().auth.history;
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

export const refreshToken = () => dispatch => {
  dispatch({
    type: "CREATE_TOKEN"
  });
  functions
    .httpsCallable("createToken")()
    .then(token => {
      dispatch({
        type: "CREATE_TOKEN_SUCCESS",
        token: token.data
      });
    })
    .catch(({ message }) => {
      Alert.alert(message);
      dispatch({
        type: "CREATE_TOKEN_FAIL"
      });
    });
};
