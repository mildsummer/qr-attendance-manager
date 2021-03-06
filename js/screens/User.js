import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
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
  changeName,
  createToken
} from "../actions";
import QRCode from "../components/QRCode";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    minHeight: "100%",
    backgroundColor: colors.accent,
    alignItems: "center"
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
  onChangeName = name => {
    const { changeName, sendName } = this.props;
    changeName(name);
    clearTimeout(this.changeNameTimer);
    this.changeNameTimer = setTimeout(() => {
      sendName();
    }, 1000);
  };

  render() {
    const {
      user,
      token,
      createToken,
      name,
      isCreatingToken,
      isSendingName
    } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          alwaysBounceVertical={false}
          centerContent={true}
        >
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
          <Text style={styles.email}>{user && user.email}</Text>
          <View style={styles.qrWrapper}>
            {token ? (
              <QRCode data={token} size="100%" errorCorrectionLevel="H" />
            ) : null}
            <TouchableWithoutFeedback
              onPress={isCreatingToken ? null : createToken}
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
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.data,
  name: state.user.name,
  token: state.user.token,
  isCreatingToken: state.user.isCreatingToken,
  isSendingName: state.user.isSendingName,
  notificationToken: state.common.notificationToken
});

const mapDispatchToProps = {
  sendName,
  changeName,
  sendPasswordResetEmail,
  createToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
