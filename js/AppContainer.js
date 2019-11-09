import React, { Component } from "react";
import { connect } from "react-redux";
import AppNavigator from "./navigators";
import { signOut } from "./actions";
import { setTopLevelNavigator } from "./middlewares/NavigateMiddleware";

class AppContainer extends Component {
  render() {
    const { signOut } = this.props;
    return (
      <AppNavigator
        ref={navigatorRef => {
          if (navigatorRef) {
            setTopLevelNavigator(navigatorRef);
          }
        }}
        screenProps={{ signOut }}
      />
    );
  }
}

export default connect(
  () => ({}),
  { signOut }
)(AppContainer);
