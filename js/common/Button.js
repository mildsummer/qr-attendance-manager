import React, { PureComponent } from "react";
import { Button } from "react-native-elements";
import colors from "../constants/colors";

export default class CustomInput extends PureComponent {
  render() {
    return (
      <Button
        {...{
          ...this.props,
          containerStyle: {
            width: "100%",
            maxWidth: 250,
            ...this.props.containerStyle
          },
          buttonStyle: {
            minHeight: 40,
            backgroundColor: "#fff",
            borderRadius: 25,
            paddingTop: 7,
            ...this.props.buttonStyle
          },
          titleStyle: {
            color: colors.accent,
            fontWeight: "500",
            ...this.props.titleStyle
          },
          disabledStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            ...this.props.disabledStyle
          },
          disabledTitleStyle: {
            color: colors.accent,
            ...this.props.disabledTitleStyle
          },
          loadingProps: {
            color: colors.accent,
            ...this.props.loadingProps
          }
        }}
      />
    );
  }
}
