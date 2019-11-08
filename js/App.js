import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { Provider } from "react-redux";
import "./firebase";
import store from "./store";
import AppContainer from "./AppContainer";
import { setupAuthStateHandler } from "./setup";
import { addChangeDateListener } from "./utils/onChangeDate";

// setup
setupAuthStateHandler(store);
if (process.env.NODE_ENV !== "test") {
  addChangeDateListener(() => {
    console.log("date changed");
    store.dispatch({
      type: "CHANGE_DATE"
    });
  });
}

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
