import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View, Keyboard, Alert } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux'
import styles from '../styles/main';
import { sendPasswordResetEmail } from '../redux';

class ResetPassword extends Component {
  state = {
    email: this.props.navigation.state.params.email || '',
    sending: false
  };

  onChangeEmail = (email) => {
    this.setState({ email });
  };

  submit = () => {
    const { sendPasswordResetEmail } = this.props;
    const { email } = this.state;
    this.setState({ sending: true });
    sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ sending: false });
        Alert.alert('メールを送信しました');
        this.goTo('Login')();
      })
      .catch(() => {
        Alert.alert('メールの送信に失敗しました');
        this.setState({ sending: false });
      });
  };

  goTo = (routeName) => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate(routeName);
    };
  };

  render() {
    const { error } = this.props;
    const { email, sending } = this.state;
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
            <View>
              <Button
                loading={sending}
                title="OK"
                onPress={this.submit}
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
  sendPasswordResetEmail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)
