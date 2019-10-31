import React from "react";
import PropTypes from "prop-types";
import { View, Image, ActivityIndicator } from "react-native";
import qrcode from "qrcode-generator";

export default class QRCode extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      size: null
    };
    this.onLayout = this.onLayout.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.size !== this.props.size) {
      this.setState({
        size: null
      });
    }
  }

  onLayout(e) {
    const { width } = e.nativeEvent.layout;
    if (this.state.size !== width) {
      this.setState({ size: width });
    }
  }

  render() {
    const {
      style,
      data,
      cellSize,
      margin,
      typeNumber,
      errorCorrectionLevel
    } = this.props;
    const size = this.state.size || this.props.size;
    const QRCode = qrcode(typeNumber, errorCorrectionLevel);
    QRCode.addData(data);
    QRCode.make();
    let calculatedCellSize = cellSize;
    if (typeof calculatedCellSize !== "number" && typeof size === "number") {
      calculatedCellSize =
        typeof margin === "number"
          ? Math.round((size - margin * 2) / QRCode.getModuleCount())
          : Math.round(size / (QRCode.getModuleCount() + 8));
    }
    const uri = QRCode.createDataURL(calculatedCellSize, margin);
    return (
      <View>
        <Image
          key={uri}
          onLayout={this.onLayout}
          style={Object.assign({}, style, {
            width: size,
            aspectRatio: 1
          })}
          source={{ uri }}
        />
        {this.state.size ? null : (
          <ActivityIndicator
            size="large"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.5)"
            }}
          />
        )}
      </View>
    );
  }
}

QRCode.defaultProps = {
  style: {},
  typeNumber: 0 // 自動
};

QRCode.propTypes = {
  style: PropTypes.object,
  color: PropTypes.string,
  data: PropTypes.string.isRequired, // データ文字列
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // 画像の大きさ
  cellSize: PropTypes.number, // セルの大きさ
  margin: PropTypes.number, // 余白の大きさ
  typeNumber: PropTypes.number, // 型番
  errorCorrectionLevel: PropTypes.string.isRequired // 誤り訂正レベル
};
