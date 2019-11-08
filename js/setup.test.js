import React from "react";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import firebase from './firebase/mock';
import { setupAuthStateHandler } from './setup';
import { INITIAL_STATE } from './reducers/auth';

const mockStore = configureMockStore([thunk]);
const db = firebase.firestore();
const auth = firebase.auth();
const store = mockStore({ auth: INITIAL_STATE });

describe("setup", () => {
  it("setup auth", () => {
    const authData = {
      uid: 'testUid',
      provider: 'custom',
      token: 'authToken',
      expires: Math.floor(new Date() / 1000) + 24 * 60 * 60,
      auth: {
        isAdmin: true
      }
    };
    db.collection('/users').add({
      uid: authData.uid
    });
    db.collection('/users').flush();
    setupAuthStateHandler({ auth, db, store });
    auth.changeAuthState(authData);
    auth.flush();
    expect(store.getActions().map((action) => (action.type))).toEqual(["AUTH_STATE_CHANGED", "GET_USER", "CREATE_TOKEN"]);
  });
});
