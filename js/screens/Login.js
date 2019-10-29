import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View, Keyboard } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux'
import { Formik } from 'formik';
import styles from '../styles/main';
import * as Yup from 'yup';
import { authUser, signIn } from '../redux';

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
          email: Yup.string().email('Emailの形式ではないようです。').required('Emailは必須です。'),
          password: Yup.string().min(6, '6文字以上。').required('パスワードは必須です。')
        })}
        validateOnChange={false}
      >
        {({ handleChange, handleSubmit, values, errors, touched, handleBlur, isValid, isSubmitting }) => (
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
                label='Your Email Address'
                errorMessage={errors.email && touched.email ? errors.email : null}
                errorStyle={{
                  position: 'absolute',
                  bottom: 0
                }}
                value={values.email}
                placeholder='email address'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <Input
                leftIcon={{
                  name: 'lock',
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
                label='Password'
                errorMessage={errors.password && touched.password ? errors.password : null}
                errorStyle={{
                  position: 'absolute',
                  bottom: 0
                }}
                value={values.password}
                placeholder='Password'
                secureTextEntry={true}
                autoCapitalize='none'
                autoCompleteType='password'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <View>
                <Button
                  title='Sign In / Register'
                  style={{
                    marginBottom: 16
                  }}
                  onPress={handleSubmit}
                  disabled={!values.email || !values.password || !isValid}
                  loading={isAuthSubmitting}
                />
                <Button
                  title="パスワードをお忘れの方はこちら"
                  onPress={this.goTo('ResetPassword', { email: values.email })}
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
  isAuthSubmitting: state.user.isAuthSubmitting
});

const mapDispatchToProps = {
  signIn
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
