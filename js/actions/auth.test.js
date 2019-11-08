import React from "react";
import { auth } from '../firebase';
import * as actions from './auth';

auth.autoFlush();

describe("auth actions", () => {
  it("SIGN_UP_USER", async () => {
    const credentials = {
      email: 'user@example.com',
      password: 'examplePass'
    };
    let user = await actions.signUp(credentials.email, credentials.password).async().promise;
    expect(user).not.toBeNull();
    user = await auth.getUserByEmail(credentials.email);
    expect(user).not.toBeNull();
  });

  it("SIGN_IN_USER", async () => {
    const credentials = {
      email: 'user2@example.com',
      password: 'examplePass'
    };
    await auth.createUser(credentials);
    const result = await actions.signIn(credentials.email, credentials.password).async().promise;
    expect(result).toEqual({
      email: credentials.email,
      isAnonymous: false
    });
  });

  it("SIGN_OUT", async () => {
    await actions.signOut().async().promise;
  });

  // it("SEND_PASSWORD_RESET_EMAIL", async () => {
  //   await actions.sendPasswordResetEmail('mild.summer.y@gmail.com').async().promise;
  // });
});
