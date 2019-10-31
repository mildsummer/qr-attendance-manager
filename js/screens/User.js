import React, { Component } from 'react';
import { Text, View, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import styles from '../styles/main';
import Input from '../common/Input';
import { sendPasswordResetEmail, verifyEmail, sendName, refreshToken } from '../redux';
import QRCode from '../common/QRCode';

class User extends Component {
  state = {
    user: this.props.user,
    phoneNumber: null,
    name: this.props.dbData ? this.props.dbData.name : '',
    sendingName: false,
    refreshing: false
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
        name: ''
      });
    }
    if (nextProps.dbData && !this.props.dbData) {
      this.setState({ name: nextProps.dbData.name });
    }
  }

  onChangeName = (name) => {
    this.setState({ name });
    clearTimeout(this.changeNameTimer);
    this.changeNameTimer = setTimeout(() => {
      this.sendName();
    }, 1000);
  };

  sendName = () => {
    const { name } = this.state;
    const { sendName } = this.props;
    this.setState({ sendingName: true });
    sendName(name)
      .then(() => {
        this.setState({ sendingName: false });
      })
      .catch(({ message }) => {
        Alert.alert(message);
        this.setState({ sendingName: false });
      });
  };

  goTo = (routeName) => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate(routeName);
    };
  };

  render() {
    const { token, refreshToken, isCreatingToken } = this.props;
    const { user, name, sendingName } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row'
            }}
          >
            <Input
              label={`QRコードに紐付けるタイトルや、\nあなたの名前などを設定してください`}
              value={name}
              autoCapitalize='none'
              placeholder="タイトル/名前を入力"
              onChangeText={this.onChangeName}
            />
            {sendingName ? (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 1
                }}
              />
            ) : null}
            {/* <Button
              title='OK'
              containerStyle={{
                width: '30%'
              }}
              loading={sendingName}
              onPress={this.sendName}
            /> */}
          </View>
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
            }}
          >
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >HOST: </Text>
            <Text
              style={{
                color: '#fff'
              }}
            >{user.email}</Text>
          </View>
          {token ? (
            <View
              style={{
                width: '100%',
                marginTop: 16,
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                overflow: 'hidden'
              }}
            >
              <QRCode
                data={token}
                size='100%'
                errorCorrectionLevel='H'
              />
              <TouchableWithoutFeedback onPress={isCreatingToken ? null : refreshToken}>
                <View
                  style={{
                    position: 'absolute',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#74dcd9',
                  }}
                >
                  {isCreatingToken ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Icon
                      name='refresh'
                      size={30}
                      color='white'
                      style={{
                        width: 30,
                        lineHeight: 50
                      }}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  dbData: state.user.dbData,
  token: state.user.token,
  isCreatingToken: state.user.isCreatingToken
});

const mapDispatchToProps = {
  verifyEmail,
  sendName,
  sendPasswordResetEmail,
  refreshToken
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
