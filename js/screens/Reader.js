import React, { Component } from "react";
import { connect } from "react-redux";
import { sendHistory, confirmHistory } from "../actions";
import {
  View,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  },
  camera: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  inner: {
    position: "relative",
    top: 0,
    left: 0,
    width: "90%",
    aspectRatio: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 1
  },
  innerLeftTop: {
    position: "absolute",
    top: 10,
    left: 10,
    width: "20%",
    aspectRatio: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)"
  },
  innerRightTop: {
    position: "absolute",
    top: 10,
    right: 10,
    width: "20%",
    aspectRatio: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)"
  },
  innerLeftBottom: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: "20%",
    aspectRatio: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)"
  },
  innerRightBottom: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: "20%",
    aspectRatio: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)"
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  }
});

class Reader extends Component {
  state = {
    hasCameraPermission: null,
    paused: false
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
    this.focusListener = navigation.addListener("didFocus", this.onFocus);
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { sentHistory, confirmHistory } = nextProps;
    if (sentHistory) {
      Alert.alert(
        "読み取りに成功しました",
        `${sentHistory.hostName}(${sentHistory.email})`
      );
      confirmHistory();
    }
  }

  onFocus = () => {
    const { paused } = this.state;
    if (paused) {
      this.camera.resumePreview();
      this.setState({ paused: false });
    }
  };

  handleScanned = result => {
    const { handleScanned, isSendingHistory, historyLog } = this.props;
    const date = new Date().toDateString();
    const token = result.data;
    if (!isSendingHistory && (!historyLog[date] || !historyLog[date][token])) {
      handleScanned(token);
    }
  };

  toggle = () => {
    const { paused } = this.state;
    if (paused) {
      this.camera.resumePreview();
    } else {
      this.camera.pausePreview();
    }
    this.setState({ paused: !paused });
  };

  render() {
    const { isSendingHistory } = this.props;
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={this.toggle}>
        <Camera
          ref={ref => {
            if (ref) {
              this.camera = ref;
            }
          }}
          onBarCodeScanned={this.handleScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]
          }}
          style={styles.camera}
          autoFocus={Camera.Constants.AutoFocus.on}
          whiteBalance={Camera.Constants.WhiteBalance.auto}
        >
          <View style={styles.inner}>
            <View style={styles.innerLeftTop} />
            <View style={styles.innerRightTop} />
            <View style={styles.innerLeftBottom} />
            <View style={styles.innerRightBottom} />
          </View>
          {isSendingHistory ? (
            <ActivityIndicator size="large" style={styles.loading} />
          ) : null}
        </Camera>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  isSendingHistory: state.history.isSendingHistory,
  historyLog: state.history.historyLog,
  sentHistory: state.history.sentHistory
});

const mapDispatchToProps = {
  handleScanned: sendHistory,
  confirmHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader);
