import React from "react";
import { db, functions } from "../firebase";
import * as actions from "./user";

db.autoFlush();

const uid = "exampleuid";
const userData = {
  email: "user@example.com"
};

describe("user actions", () => {
  it(actions.GET_USER, async () => {
    await db
      .collection("/users")
      .doc(uid)
      .set(userData);
    const asyncOptions = actions.getUser(uid).async;
    expect(db.collection("/users").doc(uid)).toEqual(asyncOptions.dbRef);
    expect(asyncOptions.dbMethod).toBe("get");
    const result = await asyncOptions.dbRef.get();
    expect(asyncOptions.payload(result)).toEqual(result.data());
  });

  it(actions.CHANGE_NAME, () => {
    const name = "testname";
    const action = actions.changeName(name);
    expect(action).toEqual({
      type: actions.CHANGE_NAME,
      payload: name
    });
  });

  it(actions.SEND_NAME, () => {
    const name = "testname";
    const asyncOptions = actions.sendName(name).async({
      getState: () => ({
        auth: {
          data: { uid }
        },
        user: { name }
      })
    });
    expect(db.collection("/users").doc(uid)).toEqual(asyncOptions.dbRef);
    expect(asyncOptions.dbMethod).toBe("set");
    expect(asyncOptions.args).toEqual([{ name }, { merge: true }]);
    expect(asyncOptions.payload).toBe(name);
  });

  it(actions.CREATE_TOKEN, () => {
    const token = "testtoken";
    const asyncOptions = actions.createToken(token).async;
    expect(asyncOptions.func).toBe("createToken");
    expect(asyncOptions.alertOnError).toBe("トークンの取得に失敗しました");
    const result = { data: "dummy" };
    expect(asyncOptions.payload(result)).toEqual(result.data);
  });
});
