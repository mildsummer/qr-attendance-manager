import React from "react";
import { db, functions } from "../firebase";
import * as actions from "./history";

db.autoFlush();

describe("history actions", () => {
  it("SEND_HISTORY", () => {
    const token = 'testtoken';
    const user = { name: 'testname' };
    const asyncOptions = actions.sendHistory(token).async({
      getState: () => ({
        user: {
          data: user
        }
      })
    });
    expect(asyncOptions.func).toBe(functions.httpsCallable('createHistory'));
    expect(asyncOptions.args).toEqual([{ token, guestName: user.name }]);
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { data: 'dummy' };
    expect(asyncOptions.data(result)).toEqual(result.data);
  });

  it("GET_HISTORY: get all by 1 loading", () => {
    const user = { uid: 'testuid', name: 'testname' };
    const size = 20;
    const asyncOptions = actions.getHistory(size).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size)
    );
    expect(asyncOptions.dbMethod).toBe('get');
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ['dummy'] };
    expect(asyncOptions.data(result)).toEqual({
      docs: result.docs,
      hasGetAll: true
    });
  });

  it("GET_HISTORY: not get all by 1 loading", () => {
    const user = { uid: 'testuid', name: 'testname' };
    const size = 20;
    const asyncOptions = actions.getHistory(size).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size)
    );
    expect(asyncOptions.dbMethod).toBe('get');
    expect(asyncOptions.alertOnError).toBe(true);
    const docs = [];
    for (let i = 0; i < 30; i++) {
      docs.push('dummy');
    }
    const result = { docs };
    expect(asyncOptions.data(result)).toEqual({
      docs: result.docs,
      hasGetAll: false
    });
  });

  it("GET_HISTORY: startAfter", async () => {
    const user = { uid: 'testuid', name: 'testname' };
    const size = 20;
    const dummyHistory = await db.collection('/users').doc(user.uid).collection('/history').add({
      hostName: user.name,
      guestName: 'test',
      email: 'test@test.com'
    });
    const asyncOptions = actions.getHistory(size, dummyHistory).async({
      getState: () => ({
        auth: {
          data: user
        }
      })
    });
    expect(asyncOptions.dbRef).toEqual(db
      .collection("/users")
      .doc(user.uid)
      .collection("/history")
      .orderBy("createdAt", "desc")
      .limit(size)
      .startAfter(dummyHistory)
    );
    expect(asyncOptions.dbMethod).toBe('get');
    expect(asyncOptions.alertOnError).toBe(true);
    const result = { docs: ['dummy'] };
    expect(asyncOptions.data(result)).toEqual({
      docs: result.docs,
      hasGetAll: true
    });
  });
});
