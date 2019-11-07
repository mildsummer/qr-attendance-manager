const INITIAL_STATE = {
  data: null,
  token: null,
  isCreatingToken: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SUCCESS_GET_USER":
      return { ...state, data: action.data };
    case "SUCCESS_SEND_NAME":
      return {
        ...state,
        data: {
          ...state.data,
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
    case "SIGN_OUT_USER":
      return INITIAL_STATE;
    default:
      return state;
  }
};
