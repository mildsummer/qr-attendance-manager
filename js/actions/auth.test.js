import React from "react";
import { auth } from "../firebase";
import * as actions from "./auth";
import * as commonActions from "./common";
import { AUTH_STATE_CHANGED } from "./auth";

auth.autoFlush();

describe("auth actions", () => {
  it(actions.SIGN_UP, async () => {
    const credentials = {
      email: "user@example.com",
      password: "examplePass"
    };
    const asyncOptions = actions.signUp(credentials.email, credentials.password)
      .async;
    expect(asyncOptions).toEqual({
      auth: true,
      func: "createUserWithEmailAndPassword",
      args: [credentials.email, credentials.password],
      alertOnError: "認証に失敗しました"
    });
  });

  it(actions.SIGN_IN, async () => {
    const credentials = {
      email: "user2@example.com",
      password: "examplePass"
    };
    const asyncOptions = actions.signIn(credentials.email, credentials.password)
      .async;
    expect(asyncOptions).toEqual({
      auth: true,
      func: "signInWithEmailAndPassword",
      args: [credentials.email, credentials.password],
      onError: actions.signUp(credentials.email, credentials.password)
    });
  });

  it(actions.SIGN_OUT, async () => {
    const asyncOptions = actions.signOut().async;
    expect(asyncOptions).toEqual({
      auth: true,
      func: "signOut",
      alertOnError: "サインアウトに失敗しました"
    });
  });

  it(actions.SEND_PASSWORD_RESET_EMAIL, async () => {
    const email = "user@example.com";
    const asyncOptions = actions.sendPasswordResetEmail(email).async;
    expect(asyncOptions).toEqual({
      auth: true,
      func: "sendPasswordResetEmail",
      args: [email],
      alertOnError: "メールの送信に失敗しました",
      alertOnSuccess: "メールを送信しました",
      onSuccess: commonActions.navigate("Login")
    });
  });

  it(actions.AUTH_STATE_CHANGED, async () => {
    const user = { email: "user@example.com" };
    let action = actions.onStateChange(user);
    expect(action).toEqual({
      type: AUTH_STATE_CHANGED,
      data: user,
      navigate: "User"
    });
    action = actions.onStateChange(null);
    expect(action).toEqual({
      type: AUTH_STATE_CHANGED,
      data: null,
      navigate: "Login"
    });
  });
});
