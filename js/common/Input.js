import React, { PureComponent } from 'react';
import { Input } from 'react-native-elements';

export default class CustomInput extends PureComponent {
  render() {
    return (
      <Input {...{
        ...this.props,
        containerStyle: {
          borderBottomColor: 'white',
          paddingHorizontal: 0,
          ...this.props.containerStyle
        },
        inputStyle: {
          paddingVertical: 10,
          textAlign: 'center',
          color: 'white',
          fontSize: 24,
          fontWeight: '200',
          ...this.props.inputStyle
        },
        inputContainerStyle: {
          borderBottomColor: 'white',
          ...this.props.inputContainerStyle
        },
        labelStyle: {
          color: 'rgba(0, 0, 0, 0.8)',
          fontSize: 12,
          fontWeight: "200",
          lineHeight: 16,
          textAlign: 'center',
          ...this.props.labelStyle
        },
        iconStyle: {
          color: 'rgba(255, 255, 255, 1)',
          ...this.props.iconStyle
        },
        placeholderTextColor: 'rgba(255, 255, 255, 0.7)'
      }} />
    );
  }
}
