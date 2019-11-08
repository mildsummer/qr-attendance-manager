import * as actions from "../actions/user";
import { success, fail } from "../utils/actionTypeHelper";

const INITIAL_STATE = {
  data: null,
  token: null,
  isCreatingToken: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case success(actions.GET_USER):
      return { ...state, data: action.data };
    case actions.SEND_NAME:
      return {
        ...state,
        isSendingName: true
      };
    case success(actions.SEND_NAME):
      return {
        ...state,
        isSendingName: false,
        data: {
          ...state.data,
          name: action.data
        }
      };
    case fail(actions.SEND_NAME):
      return {
        ...state,
        isSendingName: false
      };
    case actions.CREATE_TOKEN:
      return {
        ...state,
        isCreatingToken: true
      };
    case success(actions.CREATE_TOKEN):
      return {
        ...state,
        token: action.data,
        isCreatingToken: false
      };
    case fail(actions.CREATE_TOKEN):
      return {
        ...state,
        isCreatingToken: false
      };
    case actions.SIGN_OUT:
      return INITIAL_STATE;
    default:
      return state;
  }
};
