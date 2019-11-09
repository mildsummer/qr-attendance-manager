import * as Permissions from "expo-permissions";
import { Linking } from "react-native";

export const CHANGE_DATE = "CHANGE_DATE";
export const ASK_CAMERA_PERMISSION = "ASK_CAMERA_PERMISSION";
export const NAVIGATE = "NAVIGATE";

export const navigate = config => ({
  type: NAVIGATE,
  navigate: config
});

export const askCameraPermission = () => ({
  type: ASK_CAMERA_PERMISSION,
  async: {
    func: Permissions.askAsync,
    args: [Permissions.CAMERA],
    alertOnSuccess: result => {
      if (result.status !== "granted") {
        return [
          "カメラへのアクセス許可が必要です",
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
        ];
      } else {
        return false;
      }
    }
  }
});
