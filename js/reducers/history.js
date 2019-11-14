import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  data: null,
  currentDoc: null,
  hasGetAll: false,
  isSendingHistory: false,
  isLoading: false,
  isRefreshing: false,
  isSubmittingComment: false,
  historyLog: {},
  hasCameraPermission: false,
  askingCameraPermission: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SEND_HISTORY:
      const date = new Date().toDateString();
      const token = action.payload;
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
        hasCameraPermission: action.payload.status === "granted",
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
        data: (state.data || []).concat(action.payload.docs),
        hasGetAll: action.payload.hasGetAll,
        isLoading: false,
        isRefreshing: false
      };
    case success(actions.GET_HISTORY_BY_ID):
      return {
        ...state,
        currentDoc: action.payload
      };
    case actions.REFRESH_HISTORY:
      return {
        ...state,
        isRefreshing: true
      };
    case success(actions.REFRESH_HISTORY):
      return {
        ...state,
        data: action.payload.concat(state.data),
        isRefreshing: false
      };
    case actions.SUBMIT_COMMENT:
      return {
        ...state,
        isSubmittingComment: true
      };
    case success(actions.SUBMIT_COMMENT):
      return {
        ...state,
        isSubmittingComment: false
      };
    case fail(actions.SUBMIT_COMMENT):
      return {
        ...state,
        isSubmittingComment: false
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
