import React from "react";
import renderer from "react-test-renderer";

import App from "./setup";

describe("<App />", () => {
  let tree = null;
  it("has 1 child", () => {
    tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(1);
  });

  it("renders correctly", () => {
    expect(tree).toMatchSnapshot();
  });
});
