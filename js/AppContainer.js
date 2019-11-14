import React, { Component } from "react";
import { connect } from "react-redux";
import { SafeAreaConsumer } from "react-native-safe-area-context";
import AppNavigator from "./navigators";
import { signOut } from "./actions";
import { setTopLevelNavigator } from "./middlewares/NavigateMiddleware";

class AppContainer extends Component {
  render() {
    const { signOut } = this.props;
    return (
      <SafeAreaConsumer>
        {insets => (
          <AppNavigator
            ref={navigatorRef => {
              if (navigatorRef) {
                setTopLevelNavigator(navigatorRef);
              }
            }}
            screenProps={{ signOut, insets }}
          />
        )}
      </SafeAreaConsumer>
    );
  }
}

export default connect(
  () => ({}),
  { signOut }
)(AppContainer);
