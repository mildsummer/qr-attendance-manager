import React from "react";
import AsyncMiddleware from "./AsyncMiddleware";
import { success, fail } from "../utils/actionTypeHelper";
import AsyncMiddlewareHelpers from "./AsyncMiddlewareHelpers";

const type = "DUMMY_ACTION";
const store = {};

describe("AsyncMiddleware", () => {
  it("simply next is called", () => {
    const nextMock = jest.fn();
    const action = { type };
    AsyncMiddleware(store)(nextMock)(action);
    expect(nextMock.mock.calls.length).toBe(1);
    expect(nextMock.mock.calls[0]).toEqual([action]);
    jest.restoreAllMocks();
  });

  it("async option that succeeds", async () => {
    const nextMock = jest.fn();
    const onSuccess = jest.fn();
    const result = {};
    const alertOnSuccess = ["message"];
    const action = {
      type,
      async: {
        func: () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve(result);
            }, 1000)
          ),
        alertOnSuccess,
        onSuccess
      }
    };
    const alertSpy = spyOn(AsyncMiddlewareHelpers, "alert");
    await AsyncMiddleware(store)(nextMock)(action);
    expect(nextMock.mock.calls.length).toBe(2);
    expect(nextMock.mock.calls[1]).toEqual([
      {
        type: success(action.type),
        payload: AsyncMiddlewareHelpers.createPayload(result, action.async)
      }
    ]);
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(alertOnSuccess, result);
    expect(onSuccess.mock.calls.length).toBe(1);
    expect(onSuccess.mock.calls[0]).toEqual([result]);
    jest.restoreAllMocks();
  });

  it("onSuccess action", async () => {
    const nextMock = jest.fn();
    const onSuccess = { type: "DUMMY_SUCCESS" };
    const result = {};
    const action = {
      type,
      async: {
        func: () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve(result);
            }, 1000)
          ),
        onSuccess
      }
    };
    await AsyncMiddleware(store)(nextMock)(action);
    expect(nextMock.mock.calls.length).toBe(3);
    expect(nextMock.mock.calls[0]).toEqual([action]);
    expect(nextMock.mock.calls[1]).toEqual([
      {
        type: success(action.type),
        payload: AsyncMiddlewareHelpers.createPayload(result, action.async)
      }
    ]);
    expect(nextMock.mock.calls[2]).toEqual([onSuccess]);
    jest.restoreAllMocks();
  });

  it("async option that fails", async () => {
    const nextMock = jest.fn();
    const onError = jest.fn();
    const error = new Error();
    const alertOnError = ["message"];
    const action = {
      type,
      async: {
        func: () =>
          new Promise((resolve, reject) =>
            setTimeout(() => {
              reject(error);
            }, 1000)
          ),
        alertOnError,
        onError
      }
    };
    const alertSpy = spyOn(AsyncMiddlewareHelpers, "alert");
    await AsyncMiddleware(store)(nextMock)(action);
    expect(nextMock.mock.calls.length).toBe(2);
    expect(nextMock.mock.calls[1]).toEqual([
      {
        type: fail(action.type),
        error
      }
    ]);
    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith(alertOnError, error);
    expect(onError.mock.calls.length).toBe(1);
    expect(onError.mock.calls[0]).toEqual([error]);
    jest.restoreAllMocks();
  });

  it("onError action", async () => {
    const nextMock = jest.fn();
    const onError = { type: "DUMMY_SUCCESS" };
    const error = new Error();
    const action = {
      type,
      async: {
        func: () =>
          new Promise((resolve, reject) =>
            setTimeout(() => {
              reject(error);
            }, 1000)
          ),
        onError
      }
    };
    await AsyncMiddleware(store)(nextMock)(action);
    expect(nextMock.mock.calls.length).toBe(3);
    expect(nextMock.mock.calls[0]).toEqual([action]);
    expect(nextMock.mock.calls[1]).toEqual([
      {
        type: fail(action.type),
        error
      }
    ]);
    expect(nextMock.mock.calls[2]).toEqual([onError]);
    jest.restoreAllMocks();
  });
});
