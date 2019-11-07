import React, { Component } from "react";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import AppNavigator from "./navigators";
import { signOut } from "./actions";

const mapStateToProps = state => ({
  user: state.auth.data,
  init: state.auth.init
});

const mapDispatchToProps = {
  signOut
};

class AppContainer extends Component {
  componentWillReceiveProps(nextProps) {
    const { user, init } = this.props;
    if (nextProps.init && !init && !nextProps.user) {
      this.navigate("Login");
    } else if (user && !nextProps.user) {
      this.navigate("Login");
    } else if (!user && nextProps.user) {
      this.navigate("User");
    }
  }

  navigate(routeName) {
    this.navigator &&
      this.navigator.dispatch(NavigationActions.navigate({ routeName }));
  }

  render() {
    const { signOut } = this.props;
    return (
      <AppNavigator
        ref={ref => {
          if (ref) {
            this.navigator = ref;
          }
        }}
        screenProps={{ signOut }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
