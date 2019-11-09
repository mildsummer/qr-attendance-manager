import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import Button from "../components/Button";
import { signIn, navigate } from "../actions";
import {
  VALIDATION_EMAIL,
  VALIDATION_PASSWORD
} from "../constants/validations";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  inputContainer: {
    marginBottom: 48
  },
  inputError: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: -24,
    textAlign: "center",
    margin: 0
  },
  submitButton: {
    marginBottom: 16
  },
  resetPassword: {
    marginTop: 2,
    color: "#fff"
  }
});

class Login extends Component {
  render() {
    const { navigate, signIn, isAuthSubmitting } = this.props;
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={({ email, password }) => {
          signIn(email, password);
        }}
        validationSchema={Yup.object().shape({
          email: VALIDATION_EMAIL,
          password: VALIDATION_PASSWORD
        })}
        validateOnChange={false}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          handleBlur,
          isValid
        }) => (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.container}>
              <Input
                autoCapitalize="none"
                autoCompleteType="email"
                containerStyle={styles.inputContainer}
                label="メールアドレス"
                errorMessage={
                  errors.email && touched.email ? errors.email : null
                }
                errorStyle={styles.inputError}
                value={values.email}
                placeholder="メールアドレスを入力"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              <Input
                containerStyle={styles.inputContainer}
                label="パスワード"
                errorMessage={
                  errors.password && touched.password ? errors.password : null
                }
                errorStyle={styles.inputError}
                value={values.password}
                placeholder="パスワードを入力"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCompleteType="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
              />
              <Button
                title="ログイン / 新規登録"
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={!values.email || !values.password || !isValid}
                loading={isAuthSubmitting}
              />
              <TouchableOpacity
                onPress={() => {
                  navigate({
                    routeName: "ResetPassword",
                    params: { email: values.email }
                  });
                }}
              >
                <Text style={styles.resetPassword}>
                  パスワードをお忘れの方はこちら
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  isAuthSubmitting: state.auth.isAuthSubmitting
});

const mapDispatchToProps = {
  signIn,
  navigate
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
