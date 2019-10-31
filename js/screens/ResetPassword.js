import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux'
import styles from '../styles/main';
import { sendPasswordResetEmail } from '../redux';
import { Formik } from "formik";
import * as Yup from "yup";
import Input from '../common/Input';
import Button from '../common/Button';

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
    console.log(this.props.navigation.state.params.email);
    return (
      <Formik
        initialValues={{ email: this.props.navigation.state.params.email || '' }}
        onSubmit={this.submit}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('メールアドレスの形式で入力してください').required('メールアドレスは必須です')
        })}
        validateOnChange={false}
      >
        {({ handleChange, handleSubmit, values, errors, touched, handleBlur, isValid }) => (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
              <Text
                style={{
                  marginBottom: 32,
                  color: '#fff',
                  fontSize: 16
                }}
              >
                パスワード再設定用のメールを送信します
              </Text>
              <Input
                autoCapitalize='none'
                autoCompleteType='email'
                containerStyle={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginBottom: 48
                }}
                errorMessage={errors.email && touched.email ? errors.email : null}
                errorStyle={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  bottom: -24,
                  textAlign: 'center',
                  margin: 0
                }}
                label='メールアドレス'
                value={values.email || ''}
                placeholder='メールアドレスを入力'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <Button
                loading={sending}
                title="メール送信"
                disabled={!values.email || !isValid}
                onPress={handleSubmit}
              />
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
