const INITIAL_STATE = {
  data: null,
  token: null,
  isCreatingToken: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_USER/SUCCESS":
      return { ...state, data: action.data };
    case "SEND_NAME":
      return {
        ...state,
        isSendingName: true
      };
    case "SEND_NAME/SUCCESS":
      return {
        ...state,
        isSendingName: false,
        data: {
          ...state.data,
          name: action.data
        }
      };
    case "SEND_NAME/FAIL":
      return {
        ...state,
        isSendingName: false
      };
    case "CREATE_TOKEN":
      return {
        ...state,
        isCreatingToken: true
      };
    case "CREATE_TOKEN/SUCCESS":
      return {
        ...state,
        token: action.data,
        isCreatingToken: false
      };
    case "CREATE_TOKEN/FAIL":
      return {
        ...state,
        isCreatingToken: false
      };
    case "SIGN_OUT":
      return INITIAL_STATE;
    default:
      return state;
  }
};
