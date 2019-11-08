import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

import User from "../screens/User";
import Reader from "../screens/Reader";
import List from "../screens/List";

export default createStackNavigator({
  User: {
    screen: createBottomTabNavigator(
      {
        User: {
          screen: User,
          navigationOptions: {
            title: "ホーム",
            tabBarIcon: <MaterialIcon name="qrcode-edit" size={18} />
          }
        },
        Reader: {
          screen: Reader,
          navigationOptions: {
            title: "QR読み取り",
            tabBarIcon: <MaterialIcon name="qrcode-scan" size={18} />
          }
        },
        List: {
          screen: List,
          navigationOptions: {
            title: "履歴",
            tabBarIcon: <MaterialIcon name="history" size={20} />
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
    navigationOptions: ({ navigation, screenProps }) => ({
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
            console.log("press", screenProps.signOut);
            screenProps.signOut();
          }}
        >
          <Icon name="logout" size={17} color="#fff" />
        </TouchableOpacity>
      )
    })
  }
});
