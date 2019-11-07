import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  Text,
  View,
  Keyboard,
  Alert,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import { sendPasswordResetEmail } from "../actions";
import { Formik } from "formik";
import * as Yup from "yup";
import Input from "../components/Input";
import Button from "../components/Button";
import { VALIDATION_EMAIL } from "../constants/validations";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    marginBottom: 32,
    color: "#fff",
    fontSize: 16
  },
  inputContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: 48
  },
  inputError: {
    position: "absolute",
    width: "100%",
    left: 0,
    bottom: -24,
    textAlign: "center",
    margin: 0
  }
});

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
        Alert.alert("メールを送信しました");
        this.goTo("Login")();
      })
      .catch(() => {
        Alert.alert("メールの送信に失敗しました");
        this.setState({ sending: false });
      });
  };

  goTo = routeName => {
    return () => {
      const { navigation } = this.props;
      navigation.navigate(routeName);
    };
  };

  render() {
    const { sending } = this.state;
    return (
      <Formik
        initialValues={{
          email: this.props.navigation.state.params.email || ""
        }}
        onSubmit={this.submit}
        validationSchema={Yup.object().shape({
          email: VALIDATION_EMAIL
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
              <Text style={styles.title}>
                パスワード再設定用のメールを送信します
              </Text>
              <Input
                autoCapitalize="none"
                autoCompleteType="email"
                containerStyle={styles.inputContainer}
                errorMessage={
                  errors.email && touched.email ? errors.email : null
                }
                errorStyle={styles.inputError}
                label="メールアドレス"
                value={values.email || ""}
                placeholder="メールアドレスを入力"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
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
  user: state.auth.data
});

const mapDispatchToProps = {
  sendPasswordResetEmail
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);
