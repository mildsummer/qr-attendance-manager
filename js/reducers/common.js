import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  hasCameraPermission: false,
  askingCameraPermission: false,
  notificationToken: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.ASK_CAMERA_PERMISSION:
      return {
        ...state,
        askingCameraPermission: true
      };
    case success(actions.ASK_CAMERA_PERMISSION):
      return {
        ...state,
        hasCameraPermission: action.payload.status === "granted",
        askingCameraPermission: false
      };
    case fail(actions.ASK_CAMERA_PERMISSION):
      return {
        ...state,
        hasCameraPermission: false,
        askingCameraPermission: false
      };
    case success(actions.GET_EXPO_PUSH_TOKEN):
      return {
        ...state,
        notificationToken: action.payload
      };
    default:
      return state;
  }
};
