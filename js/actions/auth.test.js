import React from "react";
import { auth } from "../firebase";
import * as actions from "./auth";
import { signUp } from "./auth";

auth.autoFlush();

describe("auth actions", () => {
  it("SIGN_UP_USER", async () => {
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

  it("SIGN_IN_USER", async () => {
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

  it("SIGN_OUT", async () => {
    const asyncOptions = actions.signOut().async;
    expect(asyncOptions).toEqual({
      func: auth.signOut,
      alertOnError: "サインアウトに失敗しました"
    });
  });

  it("SEND_PASSWORD_RESET_EMAIL", async () => {
    const email = "user@example.com";
    const asyncOptions = actions.sendPasswordResetEmail(email).async;
    expect(asyncOptions).toEqual({
      func: auth.sendPasswordResetEmail,
      args: [email],
      alertOnError: "メールの送信に失敗しました"
    });
  });
});
