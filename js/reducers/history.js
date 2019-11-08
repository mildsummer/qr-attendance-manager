import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  data: null,
  hasGetAll: false,
  isSendingHistory: false,
  sentHistory: null,
  historyLog: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case success(actions.GET_HISTORY):
      return {
        ...state,
        data: (state.data || []).concat(action.data.docs),
        hasGetAll: action.data.hasGetAll
      };
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
    case success(actions.SEND_HISTORY):
      return {
        ...state,
        isSendingHistory: false,
        sentHistory: action.data
      };
    case fail(actions.SEND_HISTORY):
      return {
        ...state,
        isSendingHistory: false
      };
    case actions.CONFIRM_HISTORY:
      return {
        ...state,
        sentHistory: null
      };
    case success(actions.REFRESH_HISTORY):
      return {
        ...state,
        data: action.data.concat(state.data)
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
