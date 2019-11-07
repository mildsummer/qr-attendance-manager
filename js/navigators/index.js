import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import SignedOut from "./SignedOut";
import SignedIn from "./SignedIn";
import Loading from "../screens/Loading";

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      SignedOut: {
        screen: SignedOut
      },
      SignedIn: {
        screen: SignedIn
      }
    },
    {
      initialRouteName: "Loading"
    }
  )
);
