import React, { Component } from 'react';
import { Text, View, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from "react-native-vector-icons/SimpleLineIcons";
import styles from '../styles/main';
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
              label='名前/タイトル'
              value={name}
              autoCapitalize='none'
              onChangeText={this.onChangeName}
              containerStyle={{
                width: '70%'
              }}
            />
            <Button
              title='OK'
              containerStyle={{
                width: '30%'
              }}
              loading={sendingName}
              onPress={this.sendName}
            />
          </View>
          {token ? (
            <View
              style={{
                width: '100%',
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <QRCode
                data={token}
                size='100%'
                errorCorrectionLevel='H'
              />
              {isCreatingToken ? null : (
                <TouchableWithoutFeedback onPress={refreshToken}>
                  <View
                    style={{
                      position: 'absolute',
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <Icon
                      name='refresh'
                      size={30}
                      color='white'
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          ) : null}
          <Text
            style={{
              marginTop: 16,
              marginBottom: 16
            }}
          >{user.email}</Text>
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
