import React, { Component } from 'react';
import { connect } from 'react-redux'
import { handleScanned, confirmHistory } from '../redux';
import { View, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

class Reader extends Component {
  state = {
    hasCameraPermission: null,
    paused: false
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
    this.focusListener = navigation.addListener("didFocus", this.onFocus);
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { sentHistory, confirmHistory } = nextProps;
    if (sentHistory) {
      Alert.alert('読み取りに成功しました', `${sentHistory.hostName}(${sentHistory.email})`);
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

  handleScanned = (result) => {
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
      <TouchableWithoutFeedback
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
        onPress={this.toggle}
      >
        <Camera
          ref={(ref) => {
            if (ref) {
              this.camera = ref;
            }
          }}
          onBarCodeScanned={this.handleScanned}
          barCodeScannerSettings={{barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr]}}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          autoFocus={Camera.Constants.AutoFocus.on}
          whiteBalance={Camera.Constants.WhiteBalance.auto}
        >
          <View
            style={{
              position: 'relative',
              top: 0,
              left: 0,
              width: '90%',
              aspectRatio: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              zIndex: 1
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                width: '20%',
                aspectRatio: 1,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: '20%',
                aspectRatio: 1,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                width: '20%',
                aspectRatio: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                width: '20%',
                aspectRatio: 1,
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)'
              }}
            />
          </View>
          {isSendingHistory ? (
            <ActivityIndicator
              size='large'
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }}
            />
          ) : null}
        </Camera>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  isSendingHistory: state.user.isSendingHistory,
  historyLog: state.user.historyLog,
  sentHistory: state.user.sentHistory
});

const mapDispatchToProps = {
  handleScanned,
  confirmHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reader)
