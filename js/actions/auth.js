import { auth } from "../utils/firebase";
import { Alert } from "react-native";
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

// export const verifyEmail = () => (dispatch, getState) => {
//   const user = getState().auth.data;
//   if (user) {
//     Alert.alert(
//       "Email verification",
//       "We will send a verification link to your email account.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "OK",
//           onPress: () => {
//             user
//               .sendEmailVerification({
//                 url: Linking.makeUrl(FIREBASE_AUTH_DOMAIN)
//               })
//               .then(() => {
//                 Alert.alert("The email has been sent.");
//                 db.collection("/users")
//                   .doc(user.uid)
//                   .onSnapshot(docSnapshot => {
//                     const dbUser = docSnapshot.data();
//                     if (dbUser && dbUser.emailVerifiedAt) {
//                       Alert.alert("Email verification has succeeded.");
//                       dispatch({
//                         type: "SUCCESS_GET_USER",
//                         data: dbUser
//                       });
//                       user.reload().then(() => {
//                         console.log(user);
//                       });
//                     }
//                   });
//               })
//               .catch(function({ message }) {
//                 Alert.alert(message);
//               });
//           }
//         }
//       ]
//     );
//   }
// };
