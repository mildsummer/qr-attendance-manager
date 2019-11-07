const INITIAL_STATE = {
  init: false,
  isAuthSubmitting: false,
  data: null,
  dbData: null,
  history: null,
  hasGetAllHistory: false,
  phoneNumberConfirmation: null,
  isSendingHistory: false,
  sentHistory: null,
  historyLog: {},
  isCreatingToken: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "START_AUTH_USER":
      return { ...state, isAuthSubmitting: true };
    case "SUCCESS_AUTH_USER":
      return {
        ...state,
        data: action.data,
        isAuthSubmitting: false,
        init: true
      };
    case "FAIL_AUTH_USER":
      return { ...state, data: action.data, isAuthSubmitting: false };
    case "SIGN_OUT_USER":
      return INITIAL_STATE;
    case "INIT_AUTH":
      return { ...state, init: true };
    case "SUCCESS_GET_USER":
      return { ...state, dbData: action.data };
    case "SUCCESS_SEND_NAME":
      return {
        ...state,
        dbData: {
          ...state.dbData,
          name: action.name
        }
      };
    case "CREATE_TOKEN":
      return {
        ...state,
        isCreatingToken: true
      };
    case "CREATE_TOKEN_SUCCESS":
      return {
        ...state,
        token: action.token,
        isCreatingToken: false
      };
    case "CREATE_TOKEN_FAIL":
      return {
        ...state,
        isCreatingToken: false
      };
    case "SUCCESS_GET_HISTORY":
      return {
        ...state,
        history: (state.history || []).concat(action.data),
        hasGetAllHistory: action.hasGetAll
      };
    case "CONFIRM_PHONE_NUMBER":
      return {
        ...state,
        phoneNumberConfirmation: action.phoneNumberConfirmation
      };
    case "SUCCESS_CONFIRM_PHONE_NUMBER":
      return {
        ...state,
        phoneNumberConfirmation: null,
        data: action.user
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
        history: action.data.concat(state.history)
      };
    default:
      return state;
  }
};
