import { auth } from "../firebase";
// import { FIREBASE_AUTH_DOMAIN } from "react-native-dotenv";

export const signUp = (email, password) => ({
  type: "SIGN_UP",
  async: {
    func: auth.createUserWithEmailAndPassword,
    args: [email, password],
    alertOnError: "認証に失敗しました"
  }
});

export const signIn = (email, password) => ({
  type: "SIGN_IN",
  async: {
    func: auth.signInWithEmailAndPassword,
    args: [email, password],
    onError: signUp(email, password)
  }
});

export const signOut = () => ({
  type: "SIGN_OUT",
  async: {
    func: auth.signOut,
    alertOnError: "サインアウトに失敗しました"
  }
});

export const sendPasswordResetEmail = email => ({
  type: "SEND_PASSWORD_RESET_EMAIL",
  async: {
    func: auth.sendPasswordResetEmail,
    args: [email],
    alertOnError: "メールの送信に失敗しました"
  }
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
