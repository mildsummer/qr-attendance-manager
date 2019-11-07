const INITIAL_STATE = {
  init: false,
  isAuthSubmitting: false,
  data: null
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
    default:
      return state;
  }
};
