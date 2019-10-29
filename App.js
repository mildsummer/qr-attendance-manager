import React, { Component } from 'react';
import { Alert } from "react-native";
import { ThemeProvider } from 'react-native-elements';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { connect, Provider } from 'react-redux'
import Icon from "react-native-vector-icons/SimpleLineIcons";
import './js/utils/firebase';
import { store } from './js/redux'
import { auth } from "./js/utils/firebase";

// screens
import Login from './js/screens/Login';
import ResetPassword from './js/screens/ResetPassword';
import User from './js/screens/User';
import Reader from './js/screens/Reader';
import List from './js/screens/List';

const mapStateToProps = state => ({
  user: state.user.data
});

const AppNavigator = createAppContainer(createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        header: null
      }
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        title: 'パスワードをお忘れの方'
      }
    },
    User: {
      screen: createBottomTabNavigator({
        User: {
          screen: User,
          navigationOptions:  {
            title: 'User page',
            headerLeft: null,
            tabBarIcon: (<Icon name='user' size={17} />)
          }
        },
        Reader: {
          screen: Reader,
          navigationOptions:  {
            title: 'QR Reader',
            tabBarIcon: (<Icon name='user' size={17} />)
          }
        },
        List: {
          screen: List,
          navigationOptions:  {
            title: 'List',
            tabBarIcon: (<Icon name='list' size={17} />)
          }
        }
      }, {
        initialRouteName: 'User',
        order: ['Reader', 'User', 'List']
      }),
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.routes[navigation.state.index].key,
        headerLeft: (
          <Icon
            name='logout'
            size={17}
            onPress={() => {
              auth.signOut()
                .catch(({ message}) => {
                  Alert.alert(message);
                });
            }}
          />
        )
      })
    }
  }
));

const AppContainer = connect(mapStateToProps, {})(
  class extends Component {
    componentWillReceiveProps(nextProps) {
      const { user } = this.props;
      if (user && !nextProps.user) {
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
