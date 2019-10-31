import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "./utils/firebase";

// screens
import Loading from "./screens/Loading";
import Login from "./screens/Login";
import ResetPassword from "./screens/ResetPassword";
import User from "./screens/User";
import Reader from "./screens/Reader";
import List from "./screens/List";

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading,
      SignedOut: {
        screen: createStackNavigator(
          {
            Login: {
              screen: Login,
              navigationOptions: {
                title: "ログイン",
                headerTintColor: "#fff",
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: "#00c2ad"
                },
                headerTitleStyle: {
                  fontWeight: "bold"
                }
              }
            },
            ResetPassword: {
              screen: ResetPassword,
              navigationOptions: {
                title: "パスワードをお忘れの方",
                headerTintColor: "#fff",
                headerStyle: {
                  borderBottomWidth: 0,
                  backgroundColor: "#00c2ad"
                },
                headerTitleStyle: {
                  fontWeight: "bold"
                }
              }
            }
          },
          {
            initialRouteName: "Login"
          }
        )
      },
      SignedIn: {
        screen: createStackNavigator({
          User: {
            screen: createBottomTabNavigator(
              {
                User: {
                  screen: User,
                  navigationOptions: {
                    title: "ホーム",
                    tabBarIcon: <MaterialIcons name="qrcode-edit" size={18} />
                  }
                },
                Reader: {
                  screen: Reader,
                  navigationOptions: {
                    title: "QR読み取り",
                    tabBarIcon: <MaterialIcons name="qrcode-scan" size={18} />
                  }
                },
                List: {
                  screen: List,
                  navigationOptions: {
                    title: "履歴",
                    tabBarIcon: <MaterialIcons name="history" size={20} />
                  }
                }
              },
              {
                initialRouteName: "User",
                order: ["Reader", "User", "List"],
                tabBarOptions: {
                  style: {
                    borderTopWidth: 0
                  }
                }
              }
            ),
            navigationOptions: ({ navigation }) => ({
              title: {
                User: "ホーム",
                Reader: "QR読み取り",
                List: "読み取り履歴"
              }[navigation.state.routes[navigation.state.index].key],
              headerTintColor: "#fff",
              headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: "#00c2ad"
              },
              headerTitleStyle: {
                fontWeight: "bold"
              },
              headerRight: (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 6,
                    padding: 10
                  }}
                  onPress={() => {
                    auth.signOut().catch(({ message }) => {
                      Alert.alert(message);
                    });
                  }}
                >
                  <Icon name="logout" size={17} color="#fff" />
                </TouchableOpacity>
              )
            })
          }
        })
      }
    },
    {
      initialRouteName: "Loading"
    }
  )
);
