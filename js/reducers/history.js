import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  data: null,
  hasGetAll: false,
  isSendingHistory: false,
  isLoading: false,
  isRefreshing: false,
  historyLog: {},
  hasCameraPermission: false,
  askingCameraPermission: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SEND_HISTORY:
      const date = new Date().toDateString();
      const token = action.data;
      return {
        ...state,
        isSendingHistory: true,
        historyLog: {
          ...state.historyLog,
          [date]: {
            ...state.historyLog[date],
            [token]: true
          }
        }
      };
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
    case success(actions.SEND_HISTORY):
      return {
        ...state,
        isSendingHistory: false
      };
    case fail(actions.SEND_HISTORY):
      return {
        ...state,
        isSendingHistory: false
      };
    case success(actions.GET_HISTORY):
      return {
        ...state,
        data: (state.data || []).concat(action.data.docs),
        hasGetAll: action.data.hasGetAll,
        isLoading: false,
        isRefreshing: false
      };
    case actions.REFRESH_HISTORY:
      return {
        ...state,
        isRefreshing: true
      };
    case success(actions.REFRESH_HISTORY):
      return {
        ...state,
        data: action.data.concat(state.data),
        isRefreshing: false
      };
    case actions.CHANGE_DATE:
      return {
        ...state,
        historyLog: {}
      };
    case actions.SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
