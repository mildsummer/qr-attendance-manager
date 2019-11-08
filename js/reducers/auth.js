export const INITIAL_STATE = {
  init: false,
  isAuthSubmitting: false,
  isSendingHistoryPasswordResetEmail: false,
  hasSentPasswordResetEmail: false,
  data: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SIGN_UP":
      return { ...state, isAuthSubmitting: true };
    case "SIGN_IN":
      return { ...state, isAuthSubmitting: true };
    case "AUTH_STATE_CHANGED":
      return {
        ...state,
        data: action.data,
        isAuthSubmitting: false,
        init: true
      };
    case "AUTH_USER/FAIL":
      return { ...state, data: action.data, isAuthSubmitting: false };
    case "SIGN_OUT/SUCCESS":
      return INITIAL_STATE;
    case "SEND_PASSWORD_RESET_EMAIL":
      console.log('sending');
      return { ...state, isSendingHistoryPasswordResetEmail: true, hasSentPasswordResetEmail: false };
    case "SEND_PASSWORD_RESET_EMAIL/SUCCESS":
      return { ...state, isSendingHistoryPasswordResetEmail: false, hasSentPasswordResetEmail: true };
    case "SEND_PASSWORD_RESET_EMAIL/FAIL":
      return { ...state, isSendingHistoryPasswordResetEmail: false, hasSentPasswordResetEmail: false };
    default:
      return state;
  }
};
