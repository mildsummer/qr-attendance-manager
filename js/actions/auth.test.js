import React from "react";
import { auth } from "../firebase";
import * as actions from "./auth";

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
      func: auth.createUserWithEmailAndPassword,
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
      func: auth.signInWithEmailAndPassword,
      args: [credentials.email, credentials.password],
      onError: actions.signUp(credentials.email, credentials.password)
    });
  });

  it(actions.SIGN_OUT, async () => {
    const asyncOptions = actions.signOut().async;
    expect(asyncOptions).toEqual({
      func: auth.signOut,
      alertOnError: "サインアウトに失敗しました"
    });
  });

  it(actions.SEND_PASSWORD_RESET_EMAIL, async () => {
    const email = "user@example.com";
    const asyncOptions = actions.sendPasswordResetEmail(email).async;
    expect(asyncOptions).toEqual({
      func: auth.sendPasswordResetEmail,
      args: [email],
      alertOnError: "メールの送信に失敗しました"
    });
  });
});
