import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Keyboard, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { Formik } from 'formik';
import styles from '../styles/main';
import Input from '../common/Input';
import Button from '../common/Button';
import * as Yup from 'yup';
import { signIn } from '../redux';

class Login extends Component {
  signIn = ({ email, password }) => {
    const { signIn } = this.props;
    signIn(email, password);
  };

  goTo = (routeName, params = {}) => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate({ routeName, params });
    };
  };

  render() {
    const { isAuthSubmitting } = this.props;
    return (
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={this.signIn}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('メールアドレスの形式で入力してください').required('メールアドレスは必須です'),
          password: Yup.string().min(6, '6文字以上で入力してください').required('パスワードは必須です')
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
                containerStyle={{
                  marginBottom: 48
                }}
                label='メールアドレス'
                errorMessage={errors.email && touched.email ? errors.email : null}
                errorStyle={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  bottom: -24,
                  textAlign: 'center',
                  margin: 0
                }}
                value={values.email}
                placeholder='メールアドレスを入力'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <Input
                containerStyle={{
                  marginBottom: 48
                }}
                label='パスワード'
                errorMessage={errors.password && touched.password ? errors.password : null}
                errorStyle={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  bottom: -24,
                  textAlign: 'center',
                  margin: 0
                }}
                value={values.password}
                placeholder='パスワードを入力'
                secureTextEntry={true}
                autoCapitalize='none'
                autoCompleteType='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <Button
                title='ログイン / 新規登録'
                style={{
                  marginBottom: 16
                }}
                onPress={handleSubmit}
                disabled={!values.email || !values.password || !isValid}
                loading={isAuthSubmitting}
              />
              <TouchableOpacity onPress={this.goTo('ResetPassword', { email: values.email })}>
                <Text
                  style={{
                    marginTop: 2,
                    color: '#fff'
                  }}
                >パスワードをお忘れの方はこちら</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  isAuthSubmitting: state.user.isAuthSubmitting
});

const mapDispatchToProps = {
  signIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
