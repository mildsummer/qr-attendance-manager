import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View, Keyboard, Alert } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux'
import styles from '../styles/main';
import { sendPasswordResetEmail } from '../redux';
import { Formik } from "formik";
import * as Yup from "yup";

class ResetPassword extends Component {
  state = {
    sending: false
  };

  submit = ({ email }) => {
    const { sendPasswordResetEmail } = this.props;
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
    const { sending } = this.state;
    return (
      <Formik
        initialValues={{ email: this.props.navigation.state.params.email | '' }}
        onSubmit={this.submit}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Emailの形式ではないようです。').required('Emailは必須です。')
        })}
        validateOnChange={false}
      >
        {({ handleChange, handleSubmit, values, errors, touched, handleBlur, isValid }) => (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
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
                errorMessage={errors.email && touched.email ? errors.email : null}
                errorStyle={{
                  position: 'absolute',
                  bottom: 0
                }}
                label='Your Email Address'
                value={values.email}
                placeholder='email address'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <View>
                <Button
                  loading={sending}
                  title="OK"
                  disabled={!values.email || !isValid}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

const mapDispatchToProps = {
  sendPasswordResetEmail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)
