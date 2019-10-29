import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View, Keyboard } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux'
import styles from '../styles/main';
import { authUser, signIn } from '../redux';

class Login extends Component {
  state = {
    email: null,
    password: null
  };

  onChangeEmail = (email) => {
    this.setState({ email });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  signIn = () => {
    const { signIn } = this.props;
    const { email, password } = this.state;
    signIn(email, password);
  };

  auth = () => {
    const { authUser } = this.props;
    const { email, password } = this.state;
    authUser(email, password);
  };

  goTo = (routeName, params = {}) => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate({ routeName, params });
    };
  };

  render() {
    const { error } = this.props;
    const { email, password } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.container}>
          {error ? (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginBottom: 32,
                padding: 8,
                backgroundColor: 'rgb(255, 100, 100)',
                borderRadius: 8,
                overflow: 'hidden'
              }}
            >
              <Icon
                name='error'
                color='white'
                size={16}
                iconStyle={{
                  marginRight: 8
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16
                }}
              >
                {error}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              width: '100%'
            }}
          >
            <Input
              autoCapitalize='none'
              autoCompleteType='email'
              leftIcon={{
                name: 'email',
                iconStyle: {
                  marginLeft: 0,
                  marginRight: 10,
                  color: 'gray'
                }
              }}
              containerStyle={{
                paddingLeft: 0,
                paddingRight: 0,
                marginBottom: 32
              }}
              label='Your Email Address'
              value={email}
              placeholder='email@address.com'
              onChangeText={this.onChangeEmail}
            />
            <Input
              leftIcon={{
                name: 'lock',
                iconStyle: {
                  marginLeft: 0,
                  marginRight: 10,
                  color: 'gray',
                  marginHorizontal: 0,
                  start: 0
                }
              }}
              containerStyle={{
                paddingLeft: 0,
                paddingRight: 0,
                paddingBottom: 32
              }}
              label='Password'
              value={password}
              placeholder='Password'
              secureTextEntry={true}
              autoCapitalize='none'
              autoCompleteType='password'
              onChangeText={this.onChangePassword}
            />
            <View>
              <Button
                title='Register'
                style={{
                  paddingBottom: 16
                }}
                onPress={this.auth}
                disabled={!(email && password)}
              />
              <Button
                title='Sign In'
                style={{
                  paddingBottom: 16
                }}
                onPress={this.signIn}
                disabled={!(email && password)}
              />
              <Button
                title="パスワードをお忘れの方はこちら"
                onPress={this.goTo('ResetPassword', { email })}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  error: state.user.authError
});

const mapDispatchToProps = {
  authUser,
  signIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
