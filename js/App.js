import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import "./firebase";
import store from "./store";
import { auth, db } from "./firebase";
import AppContainer from "./AppContainer";
import { setupAuthStateHandler } from "./setup";
import { addChangeDateListener } from "./utils/onChangeDate";

// setup
setupAuthStateHandler({ auth, db, store });

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
