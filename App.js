import React, { Component } from 'react';
import { Alert, TouchableOpacity } from "react-native";
import { ThemeProvider } from 'react-native-elements';
import { createAppContainer, NavigationActions, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { connect, Provider } from 'react-redux'
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Iconions from "react-native-vector-icons/Ionicons";
import './js/utils/firebase';
import { store } from './js/redux'
import { auth } from "./js/utils/firebase";

// screens
import Loading from './js/screens/Loading';
import Login from './js/screens/Login';
import ResetPassword from './js/screens/ResetPassword';
import User from './js/screens/User';
import Reader from './js/screens/Reader';
import List from './js/screens/List';

const mapStateToProps = state => ({
  user: state.user.data,
  init: state.user.init
});

const AppNavigator = createAppContainer(createSwitchNavigator({
  Loading,
  SignedOut : {
    screen: createStackNavigator({
      Login: {
        screen: Login,
        navigationOptions: {
          title: 'ログイン',
          headerTintColor: '#fff',
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#74dcd9',
          },
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }
      },
      ResetPassword: {
        screen: ResetPassword,
        navigationOptions: {
          title: 'パスワードをお忘れの方',
          headerTintColor: '#fff',
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#74dcd9',
          },
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }
      }
    }, {
      initialRouteName: 'Login'
    })
  },
  SignedIn: {
    screen: createStackNavigator({
      User: {
        screen: createBottomTabNavigator({
          User: {
            screen: User,
            navigationOptions:  {
              title: 'ホーム',
              tabBarIcon: (<Icon name='user' size={17} />)
            }
          },
          Reader: {
            screen: Reader,
            navigationOptions:  {
              title: 'QR読み取り',
              tabBarIcon: (<Iconions name='ios-qr-scanner' size={17} />)
            }
          },
          List: {
            screen: List,
            navigationOptions:  {
              title: '履歴',
              tabBarIcon: (<Icon name='list' size={17} />)
            }
          }
        }, {
          initialRouteName: 'User',
          order: ['Reader', 'User', 'List'],
          tabBarOptions: {
            style: {
              borderTopWidth: 0
            }
          }
        }),
        navigationOptions: ({ navigation }) => ({
          title: ({
            User: 'ホーム',
            Reader: 'QR読み取り',
            List: '読み取り履歴'
          })[navigation.state.routes[navigation.state.index].key],
          headerTintColor: '#fff',
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: '#74dcd9',
          },
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          headerRight: (
            <TouchableOpacity
              style={{
                marginHorizontal: 6,
                padding: 10
              }}
              onPress={() => {
                auth.signOut()
                  .catch(({ message }) => {
                    Alert.alert(message);
                  });
              }}
            >
              <Icon
                name='logout'
                size={17}
                color='#fff'
              />
            </TouchableOpacity>
          )
        })
      }
    })
  }
}, {
  initialRouteName: 'Loading'
}));

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
