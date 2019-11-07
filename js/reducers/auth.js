export const INITIAL_STATE = {
  init: false,
  isAuthSubmitting: false,
  data: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "AUTH_USER":
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
    default:
      return state;
  }
};
