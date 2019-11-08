import React from "react";
import { db } from "../firebase";
import * as actions from "./user";

db.autoFlush();

const uid = "exampleuid";
const userData = {
  email: "user@example.com"
};

describe("user actions", () => {
  it("GET_USER", async () => {
    await db
      .collection("/users")
      .doc(uid)
      .set(userData);
    const asyncOptions = actions.getUser(uid).async();
    const result = await asyncOptions.promise;
    expect(result.id).toBe(uid);
    expect(result.data()).toEqual(userData);
    expect(result.data()).toEqual(asyncOptions.data(result));
  });

  it("SEND_NAME", async () => {
    const name = "testname";
    const asyncOptions = actions.sendName(name).async({
      getState: () => ({
        auth: {
          data: { uid }
        }
      })
    });
    const result = await asyncOptions.promise;
    expect(result).toEqual(Object.assign({}, userData, { name }));
    expect(asyncOptions.data).toBe(name);
  });

  // todo: CREATE_TOKEN
});
