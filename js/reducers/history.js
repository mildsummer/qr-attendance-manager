const INITIAL_STATE = {
  data: null,
  hasGetAll: false,
  isSendingHistory: false,
  sentHistory: null,
  historyLog: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SUCCESS_GET_HISTORY":
      return {
        ...state,
        data: (state.data || []).concat(action.data),
        hasGetAll: action.hasGetAll
      };
    case "SEND_HISTORY":
      const date = new Date().toDateString();
      const { token } = action;
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
    case "SEND_HISTORY_SUCCESS":
      return {
        ...state,
        isSendingHistory: false,
        sentHistory: action.data
      };
    case "SEND_HISTORY_FAIL":
      return {
        ...state,
        isSendingHistory: false
      };
    case "CONFIRM_HISTORY":
      return {
        ...state,
        sentHistory: null
      };
    case "CHANGE_DATE":
      return {
        ...state,
        historyLog: {}
      };
    case "REFRESH_HISTORY_SUCCESS":
      return {
        ...state,
        data: action.data.concat(state.data)
      };
    default:
      return state;
  }
};
