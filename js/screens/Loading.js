import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }
}
