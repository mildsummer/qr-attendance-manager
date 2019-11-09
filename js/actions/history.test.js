import React from "react";
import { db } from "../firebase";
import * as actions from "./history";

db.autoFlush();

describe("history actions", () => {
  it(actions.SEND_HISTORY, () => {
    const token = "testtoken";
    const user = { name: "testname" };
    const asyncOptions = actions.sendHistory(token).async({
      getState: () => ({
        user: {
          data: user
        }
      })
    });
    expect(asyncOptions.func).toBe("createHistory");
    expect(asyncOptions.args).toEqual([{ token, guestName: user.name }]);
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { data: "dummy" };
    expect(asyncOptions.payload(result)).toEqual(result.data);
  });

  it(`${actions.GET_HISTORY}: get all by 1 loading`, () => {
    const user = { uid: "testuid", name: "testname" };
    const size = 20;
    const asyncOptions = actions.getHistory(size).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(
      db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .orderBy("createdAt", "desc")
        .limit(size)
    );
    expect(asyncOptions.dbMethod).toBe("get");
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ["dummy"] };
    expect(asyncOptions.payload(result)).toEqual({
      docs: result.docs,
      hasGetAll: true
    });
  });

  it(`${actions.GET_HISTORY}: not get all by 1 loading`, () => {
    const user = { uid: "testuid", name: "testname" };
    const size = 20;
    const asyncOptions = actions.getHistory(size).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(
      db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .orderBy("createdAt", "desc")
        .limit(size)
    );
    expect(asyncOptions.dbMethod).toBe("get");
    expect(asyncOptions.alertOnError).toBe(true);
    const docs = [];
    for (let i = 0; i < 30; i++) {
      docs.push("dummy");
    }
    const result = { docs };
    expect(asyncOptions.payload(result)).toEqual({
      docs: result.docs,
      hasGetAll: false
    });
  });

  it(`${actions.GET_HISTORY}: startAfter`, async () => {
    const user = { uid: "testuid", name: "testname" };
    const size = 20;
    const dummyHistory = await db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .add({
        hostName: user.name,
        guestName: "test",
        email: "test@test.com"
      });
    const asyncOptions = actions.getHistory(size, dummyHistory).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(
      db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .orderBy("createdAt", "desc")
        .limit(size)
        .startAfter(dummyHistory)
    );
    expect(asyncOptions.dbMethod).toBe("get");
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ["dummy"] };
    expect(asyncOptions.payload(result)).toEqual({
      docs: result.docs,
      hasGetAll: true
    });
  });

  it(`${actions.REFRESH_HISTORY}: first history`, () => {
    const user = { uid: "testuid", name: "testname" };
    const asyncOptions = actions.refreshHistory().async({
      getState: () => ({
        auth: {
          data: user
        },
        history: {
          data: null
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(
      db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .orderBy("createdAt", "desc")
    );
    expect(asyncOptions.dbMethod).toBe("get");
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ["dummy"] };
    expect(asyncOptions.payload(result)).toBe(result.docs);
  });

  it(`${actions.REFRESH_HISTORY}: has already get history`, () => {
    const user = { uid: "testuid", name: "testname" };
    const history = [{ hostName: "dummy", guestName: "dummy" }];
    const asyncOptions = actions.refreshHistory().async({
      getState: () => ({
        auth: {
          data: user
        },
        history: {
          data: history
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(
      db
        .collection("/users")
        .doc(user.uid)
        .collection("/history")
        .orderBy("createdAt", "desc")
        .endBefore(history[0])
    );
    expect(asyncOptions.dbMethod).toBe("get");
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ["dummy"] };
    expect(asyncOptions.payload(result)).toBe(result.docs);
  });
});
