import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import styles from '../styles/main';
import { signOut, sendPasswordResetEmail, verifyEmail } from '../redux';
import QRCode from '../common/QRCode';

class User extends Component {
  state = {
    user: this.props.user,
    phoneNumber: null,
    phoneNumberVerificationCode: null
  };

  componentDidMount() {
    const { user } = this.state;
    if (!user.emailVerified) {
      this.props.verifyEmail();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user !== this.state.user) {
      this.setState({
        user: nextProps.user
      });
    }
  }

  goTo = (routeName) => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate(routeName);
    };
  };

  render() {
    // const { signOut, sendPasswordResetEmail } = this.props;
    const { token, signOut } = this.props;
    const { user } = this.state;
    return (
      <View style={styles.container}>
        {token ? (
          <QRCode
            data={token}
            size='100%'
            errorCorrectionLevel='H'
          />
        ) : null}
        <Text
          style={{
            marginTop: 16,
            marginBottom: 16
          }}
        >{user.email}</Text>
        {user.phoneNumber ? (
          <Text
            style={{
              marginBottom: 16
            }}
          >{user.phoneNumber}</Text>
        ) : null}
        <View
          style={{
            width: '100%',
          }}
        >
          {/* <Button
            style={{
              marginBottom: 16
            }}
            title='Reset password'
            onPress={sendPasswordResetEmail}
          /> */}
          <Button
            style={{
              marginBottom: 16
            }}
            title='Sign out'
            onPress={signOut}
          />
          <Button
            title="Reader"
            onPress={this.goTo('Reader')}
          />
          <Button
            title="List"
            onPress={this.goTo('List')}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  token: state.user.token
});

const mapDispatchToProps = {
  signOut,
  verifyEmail,
  sendPasswordResetEmail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
