import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Notifications } from "expo";
import { Alert, Platform } from "react-native";
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

fetch('https://qr-attendance-manager.firebaseapp.com/notification_category.json')
  .then((response) => response.json())
  .then(async (category) => {
    if (category.categoryId) {
      try {
        await Notifications.deleteCategoryAsync(category.categoryId);
        await Notifications.createCategoryAsync(category.categoryId, category.actions);
        console.log(category.categoryId, 'create success');
        Notifications.addListener(notification => {
          console.log('received', notification);
          const action = category.actions.find((action) => (action.actionId === notification.actionId));
          if (action) {
            Alert.alert(JSON.stringify(notification));
          }
        });
      } catch ({ error }) {
        Alert.alert(message);
      }
    }
  }).catch((error) => {
    console.log(error);
});

Notifications.addListener(notification => {
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
  if (typeof notification.data.badge === 'number' && Platform.OS === 'ios') {
    Notifications.setBadgeNumberAsync(notification.data.badge);
  }
  if (notification.data.local) {
    if (notification.data.localSchedulingOptions) {
      Notifications.scheduleLocalNotificationAsync(notification.data.local, notification.data.localSchedulingOptions);
    } else {
      Notifications.presentLocalNotificationAsync(notification.data.local);
    }
  }
});
Notifications.cancelAllScheduledNotificationsAsync();

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
