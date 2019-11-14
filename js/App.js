import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Notifications } from "expo";
import { Alert } from "react-native";
import { Provider } from "react-redux";
import "./firebase";
import * as actions from "./actions";
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
      type: actions.CHANGE_DATE
    });
  });
}
Notifications.addListener(notification => {
  console.log(notification);
  store.dispatch({
    type: actions.RECEIVE_NOTIFICATION,
    payload: notification
  });
  if (notification.data.historyId) {
    if (notification.origin === "selected") {
      store.dispatch(
        actions.navigate({
          routeName: "HistoryDetail",
          params: { id: notification.data.historyId }
        })
      );
    } else if (notification.origin === "received") {
      Alert.alert(
        `[${notification.data.name}]コメントが届きました`,
        "詳細画面へ移動しますか？",
        [
          {
            text: "キャンセル",
            style: "cancel"
          },
          {
            text: "移動する",
            onPress: () => {
              store.dispatch(
                actions.navigate({
                  routeName: "HistoryDetail",
                  params: { id: notification.data.historyId }
                })
              );
            }
          }
        ]
      );
    }
  }
});

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <SafeAreaProvider>
            <AppContainer />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}
