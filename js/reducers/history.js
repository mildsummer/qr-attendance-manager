const INITIAL_STATE = {
  data: null,
  hasGetAll: false,
  isSendingHistory: false,
  sentHistory: null,
  historyLog: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_HISTORY/SUCCESS":
      return {
        ...state,
        data: (state.data || []).concat(action.data.docs),
        hasGetAll: action.data.hasGetAll
      };
    case "SEND_HISTORY":
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
    case "SEND_HISTORY/SUCCESS":
      return {
        ...state,
        isSendingHistory: false,
        sentHistory: action.data
      };
    case "SEND_HISTORY/FAIL":
      return {
        ...state,
        isSendingHistory: false
      };
    case "CONFIRM_HISTORY":
      return {
        ...state,
        sentHistory: null
      };
    case "REFRESH_HISTORY/SUCCESS":
      return {
        ...state,
        data: action.data.concat(state.data)
      };
    case "CHANGE_DATE":
      return {
        ...state,
        historyLog: {}
      };
    case "SIGN_OUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
