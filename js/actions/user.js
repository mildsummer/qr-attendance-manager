import { db, functions } from "../utils/firebase";
import { Alert } from "react-native";

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
