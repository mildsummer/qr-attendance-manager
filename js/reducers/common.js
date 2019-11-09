import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  hasCameraPermission: false,
  askingCameraPermission: false
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
        hasCameraPermission: action.data.status === "granted",
        askingCameraPermission: false
      };
    case fail(actions.ASK_CAMERA_PERMISSION):
      return {
        ...state,
        hasCameraPermission: false,
        askingCameraPermission: false
      };
    default:
      return state;
  }
};
