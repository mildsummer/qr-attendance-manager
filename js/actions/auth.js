import { auth } from "../firebase";
// import { FIREBASE_AUTH_DOMAIN } from "react-native-dotenv";

export const signUp = (email, password) => ({
  type: "SIGN_UP",
  async: () => ({
    promise: auth.createUserWithEmailAndPassword(email, password),
    alertOnError: '認証に失敗しました'
  })
});

export const signIn = (email, password) => ({
  type: "SIGN_IN",
  async: () => ({
    promise: auth.signInWithEmailAndPassword(email, password),
    onError: signUp(email, password)
  })
});

export const signOut = () => ({
  type: "SIGN_OUT",
  async: () => ({
    promise: auth.signOut(),
    alertOnError: "サインアウトに失敗しました"
  })
});

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
