import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import ResetPassword from "../screens/ResetPassword";

export default createStackNavigator(
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
);
