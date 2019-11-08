import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/SimpleLineIcons";
import Input from "../components/Input";
import {
  sendPasswordResetEmail,
  sendName,
  refreshToken
} from "../actions";
import QRCode from "../components/QRCode";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  nameWrapper: {
    width: "100%"
  },
  nameLoading: {
    position: "absolute",
    bottom: 14,
    right: 0
  },
  email: {
    marginTop: 16,
    color: "#fff"
  },
  qrWrapper: {
    width: "100%",
    marginTop: 16,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden"
  },
  refreshButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.accent
  },
  refreshIcon: {
    width: 30,
    lineHeight: 50
  }
});

class User extends Component {
  state = {
    user: this.props.user,
    name: this.props.dbData ? this.props.dbData.name : ""
  };

  componentDidMount() {
    const { user } = this.state;
    if (!user.emailVerified) {
      // this.props.verifyEmail();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user,
        name: ""
      });
    }
    if (nextProps.dbData && !this.props.dbData) {
      this.setState({ name: nextProps.dbData.name });
    }
  }

  onChangeName = name => {
    this.setState({ name });
    clearTimeout(this.changeNameTimer);
    this.changeNameTimer = setTimeout(() => {
      this.sendName();
    }, 1000);
  };

  sendName = () => {
    const { name } = this.state;
    const { sendName } = this.props;
    sendName(name);
  };

  goTo = routeName => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate(routeName);
    };
  };

  render() {
    const { token, refreshToken, isCreatingToken, isSendingName } = this.props;
    const { user, name } = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.nameWrapper}>
            <Input
              label={`QRコードに紐付けるタイトルや、\nあなたの名前などを設定してください`}
              value={name}
              autoCapitalize="none"
              placeholder="タイトル/名前を入力"
              onChangeText={this.onChangeName}
            />
            {isSendingName ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={styles.nameLoading}
              />
            ) : null}
          </View>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.qrWrapper}>
            {token ? (
              <QRCode data={token} size="100%" errorCorrectionLevel="H" />
            ) : null}
            <TouchableWithoutFeedback
              onPress={isCreatingToken ? null : refreshToken}
            >
              <View style={styles.refreshButton}>
                {isCreatingToken ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon
                    name="refresh"
                    size={30}
                    color="white"
                    style={styles.refreshIcon}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.data,
  dbData: state.user.data,
  token: state.user.token,
  isCreatingToken: state.user.isCreatingToken,
  isSendingName: state.user.isSendingName
});

const mapDispatchToProps = {
  sendName,
  sendPasswordResetEmail,
  refreshToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
