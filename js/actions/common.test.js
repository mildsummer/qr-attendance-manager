import React from "react";
import * as Permissions from "expo-permissions";
import * as actions from "./common";

describe("common actions", () => {
  it(actions.ASK_CAMERA_PERMISSION, () => {
    const asyncOptions = actions.askCameraPermission().async;
    expect(asyncOptions.func).toBe(Permissions.askAsync);
    expect(asyncOptions.args).toEqual([Permissions.CAMERA]);
    expect(asyncOptions.alertOnSuccess({ status: "granted" })).toBe(false);
  });
});
