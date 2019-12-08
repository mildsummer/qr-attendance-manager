import * as Permissions from "expo-permissions";
import { Linking } from "react-native";
import { Notifications } from "expo";
import { db } from "../firebase";

export const CHANGE_DATE = "CHANGE_DATE";
export const ASK_CAMERA_PERMISSION = "ASK_CAMERA_PERMISSION";
export const NAVIGATE = "NAVIGATE";
export const ASK_NOTIFICATION_PERMISSION = "ASK_NOTIFICATION_PERMISSION";
export const GET_NOTIFICATION_PERMISSION = "GET_NOTIFICATION_PERMISSION";
export const SET_EXPO_PUSH_TOKEN = "SET_EXPO_PUSH_TOKEN";
export const GET_EXPO_PUSH_TOKEN = "GET_EXPO_PUSH_TOKEN";
export const RECEIVE_NOTIFICATION = "RECEIVE_NOTIFICATION";

export const navigate = config => ({
  type: NAVIGATE,
  navigate: config"カメラへのアクセス許可が必要です",
  "設定画面へ移動しますか？",
  [
    {
      text: "今はしない",
      style: "cancel"
    },
{
  text: "設定する",
    onPress: () => {
  Linking.openURL("app-settings:");
}
}
]
});

export const askCameraPermission = () => ({
  type: ASK_CAMERA_PERMISSION,
  async: {
    func: Permissions.askAsync,
    args: [Permissions.CAMERA],
    alertOnSuccess: result => {
      if (result.status !== "granted") {
        return [

        ];
      } else {
        return false;
      }
    }
  }
});

export const setPushToken = pushToken => ({
  type: SET_EXPO_PUSH_TOKEN,
  async: store => ({
    dbRef: db.collection("/users").doc(store.getState().auth.data.uid),
    dbMethod: "update",
    args: [
      {
        pushTokens: (store.getState().user.data.pushTokens || []).concat(
          pushToken
        )
      }
    ],
    alertOnError: true
  })
});

export const getExpoPushToken = () => ({
  type: GET_EXPO_PUSH_TOKEN,
  async: store => ({
    func: Notifications.getExpoPushTokenAsync,
    onSuccess: pushToken => {
      if (
        (store.getState().user.data.pushTokens || []).indexOf(pushToken) === -1
      ) {
        return setPushToken(pushToken);
      } else {
        return false;
      }
    },
    alertOnError: true
  })
});

export const askNotificationPermission = () => ({
  type: ASK_NOTIFICATION_PERMISSION,
  async: {
    func: Permissions.askAsync,
    args: [Permissions.NOTIFICATIONS],
    onSuccess: result => {
      if (result.status === "granted") {
        return getExpoPushToken();
      } else {
        return false;
      }
    },
    alertOnError: true
  }
});

export const getNotificationPermission = () => ({
  type: GET_NOTIFICATION_PERMISSION,
  async: {
    func: Permissions.getAsync,
    args: [Permissions.NOTIFICATIONS],
    onSuccess: result => {
      if (result.status === "granted") {
        return getExpoPushToken();
      } else {
        return askNotificationPermission();
      }
    },
    alertOnError: true
  }
});
