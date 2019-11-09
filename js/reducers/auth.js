import * as actions from "../actions";
import { success, fail } from "../utils/actionTypeHelper";

export const INITIAL_STATE = {
  init: false,
  isAuthSubmitting: false,
  isSendingHistoryPasswordResetEmail: false,
  data: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.SIGN_UP:
      return { ...state, isAuthSubmitting: true };
    case fail(actions.SIGN_UP):
      return { ...state, isAuthSubmitting: false };
    case actions.SIGN_IN:
      return { ...state, isAuthSubmitting: true };
    case actions.AUTH_STATE_CHANGED:
      return {
        ...state,
        data: action.payload,
        isAuthSubmitting: false,
        init: true
      };
    case success(actions.SIGN_OUT):
      return INITIAL_STATE;
    case actions.SEND_PASSWORD_RESET_EMAIL:
      return {
        ...state,
        isSendingHistoryPasswordResetEmail: true
      };
    case success(actions.SEND_PASSWORD_RESET_EMAIL):
      return {
        ...state,
        isSendingHistoryPasswordResetEmail: false
      };
    case fail(actions.SEND_PASSWORD_RESET_EMAIL):
      return {
        ...state,
        isSendingHistoryPasswordResetEmail: false
      };
    default:
      return state;
  }
};
