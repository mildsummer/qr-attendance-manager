import React from "react";
import AsyncMiddlewareHelper from "./AsyncMiddlewareHelper";

const type = "DUMMY_ACTION";
const state = {
  user: {
    data: {
      id: 100
    }
  }
};
const store = {
  getState: () => (state)
};

describe("AsyncMiddlewareHelper", () => {
  it("getAsyncOptions", () => {
    const func = "funcname";
    let action = {
      type,
      async: { func }
    };
    expect(AsyncMiddlewareHelper.getAsyncOptions(action, store)).toBe(action.async);
    action = {
      type,
      async: (store) => ({
        func,
        args: [store.getState().user.data.id]
      })
    };
    expect(AsyncMiddlewareHelper.getAsyncOptions(action, store)).toEqual({
      func,
      args: [state.user.data.id]
    });
  });
});
