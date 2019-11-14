import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
  HISTORY_TYPE_GUEST,
  HISTORY_TYPE_HOST
} from "../../functions/constants/common";
import { submitComment, getHistoryById } from "../actions";
import colors from "../constants/colors";
import Button from "../components/Button";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24
  },
  item: {
    marginBottom: 16
  },
  title: {
    color: colors.accent,
    fontWeight: "500"
  },
  value: {
    fontSize: 21,
    marginTop: 10
  },
  email: {
    marginTop: 5,
    color: "rgba(0, 0, 0, 0.5)"
  },
  commentWrapper: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.lighGray,
    borderRadius: 8
  },
  input: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.lighGray,
    height: 140,
    borderRadius: 8
  },
  button: {}
});

class HistoryDetail extends Component {
  constructor(props) {
    super(props);
    const currentDoc = this.currentDoc();
    if (!currentDoc) {
      props.getHistoryById(props.navigation.state.params.id);
    }
  }

  submit = ({ comment }) => {
    const { submitComment } = this.props;
    const currentDoc = this.currentDoc();
    const currentData = currentDoc.data();
    const current =
      (currentData.type === HISTORY_TYPE_HOST
        ? currentData.hostComment
        : currentData.guestComment) || "";
    if (comment !== current) {
      submitComment(currentDoc.id, comment);
    }
  };

  currentDoc = () => {
    const { navigation, data, doc } = this.props;
    const id = navigation.state.params.id;
    return data ? data.find(doc => doc.id === id) : doc || null;
  };

  render() {
    const { isSubmittingComment } = this.props;
    const currentDoc = this.currentDoc();
    if (currentDoc) {
      const currentData = currentDoc.data();
      const createdAt = new Date(currentData.createdAt.seconds * 1000);
      const createdAtString = `${createdAt.getFullYear()}年${createdAt.getMonth() +
        1}月${createdAt.getDate()}日 ${createdAt.getHours()}:${createdAt
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={styles.wrapper}
            keyboardVerticalOffset={108}
            behavior="padding"
            enabled
          >
            <ScrollView style={styles.container}>
              <View style={styles.item}>
                <Text style={styles.title}>ホスト名</Text>
                <Text style={styles.value}>{currentData.hostName || "-"}</Text>
                {currentData.type === HISTORY_TYPE_GUEST ? (
                  <Text style={styles.email}>{currentData.email}</Text>
                ) : null}
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>ゲスト名</Text>
                <Text style={styles.value}>{currentData.guestName || "-"}</Text>
                {currentData.type === HISTORY_TYPE_HOST ? (
                  <Text>{currentData.email}</Text>
                ) : null}
              </View>
              <View style={styles.item}>
                <Text style={styles.title}>日時</Text>
                <Text style={styles.value}>{createdAtString}</Text>
              </View>
              {currentData.type === HISTORY_TYPE_HOST &&
              currentData.guestComment ? (
                <View style={styles.item}>
                  <Text style={styles.title}>相手からのコメント</Text>
                  <View style={styles.commentWrapper}>
                    <Text style={styles.comment}>
                      {currentData.guestComment}
                    </Text>
                  </View>
                </View>
              ) : null}
              {currentData.type === HISTORY_TYPE_GUEST &&
              currentData.hostComment ? (
                <View style={styles.item}>
                  <Text style={styles.title}>相手からのコメント</Text>
                  <View style={styles.commentWrapper}>
                    <Text style={styles.comment}>
                      {currentData.hostComment}
                    </Text>
                  </View>
                </View>
              ) : null}
              <Formik
                initialValues={{
                  comment:
                    (currentData.type === HISTORY_TYPE_HOST
                      ? currentData.hostComment
                      : currentData.guestComment) || ""
                }}
                onSubmit={this.submit}
              >
                {({ handleChange, handleSubmit, values }) => (
                  <View style={styles.item}>
                    <Text style={styles.title}>あなたからのコメント</Text>
                    <TextInput
                      style={styles.input}
                      value={values.comment}
                      onChangeText={handleChange("comment")}
                      autoCapitalize="none"
                      numberOfLines={5}
                      multiline={true}
                    />
                    <Button
                      title="送信"
                      onPress={handleSubmit}
                      style={{
                        marginTop: 16,
                        marginBottom: 42
                      }}
                      buttonStyle={{
                        backgroundColor: colors.accent
                      }}
                      titleStyle={{
                        color: "#fff"
                      }}
                      loadingProps={{
                        color: "#fff"
                      }}
                      loading={isSubmittingComment}
                    />
                  </View>
                )}
              </Formik>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View style={styles.wrapper}>
          <ActivityIndicator
            style={styles.wrapper}
            color={colors.accent}
            size="large"
          />
        </View>
      );
    }
  }
}

const mapStateToProps = state => ({
  data: state.history.data,
  doc: state.history.currentDoc,
  isSubmittingComment: state.history.isSubmittingComment
});

const mapDispatchToProps = {
  submitComment,
  getHistoryById
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryDetail);
