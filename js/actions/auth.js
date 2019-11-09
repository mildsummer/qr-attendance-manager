// import { FIREBASE_AUTH_DOMAIN } from "react-native-dotenv";
import { navigate } from "./common";

export const SIGN_UP = "SIGN_UP";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SEND_PASSWORD_RESET_EMAIL = "SEND_PASSWORD_RESET_EMAIL";
export const AUTH_STATE_CHANGED = "AUTH_STATE_CHANGED";

export const signUp = (email, password) => ({
  type: SIGN_UP,
  async: {
    auth: true,
    func: "createUserWithEmailAndPassword",
    args: [email, password],
    alertOnError: "認証に失敗しました"
  }
});

export const signIn = (email, password) => ({
  type: SIGN_IN,
  async: {
    auth: true,
    func: "signInWithEmailAndPassword",
    args: [email, password],
    onError: signUp(email, password)
  }
});

export const signOut = () => ({
  type: SIGN_OUT,
  async: {
    auth: true,
    func: "signOut",
    alertOnError: "サインアウトに失敗しました"
  }
});

export const sendPasswordResetEmail = email => ({
  type: SEND_PASSWORD_RESET_EMAIL,
  async: {
    auth: true,
    func: "sendPasswordResetEmail",
    args: [email],
    alertOnError: "メールの送信に失敗しました",
    alertOnSuccess: "メールを送信しました",
    onSuccess: navigate("Login")
  }
});

export const onStateChange = user => ({
  type: AUTH_STATE_CHANGED,
  payload: user,
  navigate: user ? "User" : "Login"
});

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
