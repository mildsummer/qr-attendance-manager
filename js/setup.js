import React, { Component } from "react";
import { ThemeProvider } from "react-native-elements";
import { NavigationActions } from "react-navigation";
import { connect, Provider } from "react-redux";
import "./utils/firebase";
import store from "./store";
import AppNavigator from "./AppNavigator";
import { auth, db } from "./utils/firebase";
import { addChangeDateListener } from "./utils/onChangeDate";
import { refreshToken } from "./actions";

auth.onAuthStateChanged(user => {
  console.log("auth state changed", user);
  const current = store.getState().auth.data;
  if (!current && user) {
    store.dispatch({
      type: "SUCCESS_AUTH_USER",
      data: user
    });
    db.collection("/users")
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        store.dispatch({
          type: "SUCCESS_GET_USER",
          data: documentSnapshot.data()
        });
      });
    refreshToken()(store.dispatch);
  } else if (current && !user) {
    store.dispatch({
      type: "SIGN_OUT_USER"
    });
  } else if (!user) {
    store.dispatch({
      type: "INIT_AUTH"
    });
  }
});

addChangeDateListener(() => {
  console.log("date changed");
  store.dispatch({
    type: "CHANGE_DATE"
  });
});

const mapStateToProps = state => ({
  user: state.auth.data,
  init: state.auth.init
});

const AppContainer = connect(
  mapStateToProps,
  {}
)(
  class extends Component {
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
      return (
        <AppNavigator
          ref={ref => {
            if (ref) {
              this.navigator = ref;
            }
          }}
        />
      );
    }
  }
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <AppContainer />
        </ThemeProvider>
      </Provider>
    );
  }
}
