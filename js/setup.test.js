import React from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { auth } from "./firebase";
import { setupAuthStateHandler } from "./setup";
import { INITIAL_STATE } from "./reducers/auth";

describe("setup", () => {
  it("setup auth", () => {
    const mockStore = configureMockStore([thunk]);
    const store = mockStore({ auth: INITIAL_STATE });
    const authData = {
      uid: "testUid",
      provider: "custom",
      token: "authToken",
      expires: Math.floor(new Date() / 1000) + 24 * 60 * 60,
      auth: {
        isAdmin: true
      }
    };
    setupAuthStateHandler(store);
    auth.changeAuthState(authData);
    auth.flush();
    expect(store.getActions().map(action => action.type)).toEqual([
      "AUTH_STATE_CHANGED",
      "GET_USER",
      "CREATE_TOKEN"
    ]);
  });
});
