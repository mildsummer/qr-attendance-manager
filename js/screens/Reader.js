import React, { Component } from "react";
import { connect } from "react-redux";
import { sendHistory, askCameraPermission } from "../actions";
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet
} from "react-native";
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
    paused: false
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "didFocus",
      this.onFocus
    );
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  onFocus = () => {
    const {
      hasCameraPermission,
      askCameraPermission,
      askingCameraPermission
    } = this.props;
    const { paused } = this.state;
    if (paused) {
      this.toggle();
    }
    if (!hasCameraPermission && !askingCameraPermission) {
      askCameraPermission();
    }
  };

  handleScanned = result => {
    const { sendHistory, isSendingHistory, historyLog } = this.props;
    const date = new Date().toDateString();
    const token = result.data;
    if (!isSendingHistory && (!historyLog[date] || !historyLog[date][token])) {
      sendHistory(token);
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
    const { isSendingHistory, hasCameraPermission } = this.props;
    return hasCameraPermission ? (
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
    ) : null;
  }
}

const mapStateToProps = state => ({
  isSendingHistory: state.history.isSendingHistory,
  historyLog: state.history.historyLog,
  sentHistory: state.history.sentHistory,
  hasCameraPermission: state.common.hasCameraPermission,
  askingCameraPermission: state.common.askingCameraPermission
});

const mapDispatchToProps = {
  sendHistory,
  askCameraPermission
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader);
