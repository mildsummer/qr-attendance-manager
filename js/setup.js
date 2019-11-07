import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import "./utils/firebase";
import store from "./store";
import { auth, db } from "./utils/firebase";
import { addChangeDateListener } from "./utils/onChangeDate";
import { refreshToken } from "./actions";
import AppContainer from './AppContainer';

auth.onAuthStateChanged(user => {
  console.log("auth state changed", user);
  const current = store.getState().auth.data;
  if (!current && user) {
    store.dispatch({
      type: "SUCCESS_AUTH_USER",
      data: user
    });
    db.collection("/users")
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        store.dispatch({
          type: "SUCCESS_GET_USER",
          data: documentSnapshot.data()
        });
      });
    refreshToken()(store.dispatch);
  } else if (current && !user) {
    store.dispatch({
      type: "SIGN_OUT_USER"
    });
  } else if (!user) {
    store.dispatch({
      type: "INIT_AUTH"
    });
  }
});

addChangeDateListener(() => {
  console.log("date changed");
  store.dispatch({
    type: "CHANGE_DATE"
  });
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <AppContainer />
        </ThemeProvider>
      </Provider>
    );
  }
}
