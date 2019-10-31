import React, { Component } from 'react';
import { ThemeProvider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import { connect, Provider } from 'react-redux'
import './js/utils/firebase';
import { store } from './js/redux'
import AppNavigator from './js/AppNavigator';

const mapStateToProps = state => ({
  user: state.user.data,
  init: state.user.init
});

const AppContainer = connect(mapStateToProps, {})(
  class extends Component {
    componentWillReceiveProps(nextProps) {
      const { user, init } = this.props;
      if (nextProps.init && !init && !nextProps.user) {
        this.navigate('Login');
      } else if (user && !nextProps.user) {
        this.navigate('Login');
      } else if (!user && nextProps.user) {
        this.navigate('User');
      }
    }

    navigate(routeName) {
      this.navigator && this.navigator.dispatch(NavigationActions.navigate({ routeName }));
    }

    render() {
      return (
        <AppNavigator
          ref={(ref) => {
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
