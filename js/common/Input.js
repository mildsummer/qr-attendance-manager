import React, { PureComponent } from 'react';
import { Input } from 'react-native-elements';

const containerStyle = {
  borderBottomColor: 'white',
  paddingHorizontal: 0
};

const inputContainerStyle = {
  borderBottomColor: 'white'
};

const inputStyle = {
  paddingVertical: 10,
  textAlign: 'center',
  color: 'white',
  fontSize: 24,
  fontWeight: '200'
};

const labelStyle = {
  color: 'rgba(0, 0, 0, 0.8)',
  fontSize: 12,
  fontWeight: "200",
  textAlign: 'center'
};

const iconStyle = {
  color: 'rgba(255, 255, 255, 1)'
};

export default class CustomInput extends PureComponent {
  render() {
    return (
      <Input {...{
        ...this.props,
        containerStyle: {
          ...containerStyle,
          ...this.props.containerStyle
        },
        inputStyle: {
          ...inputStyle,
          ...this.props.inputStyle
        },
        inputContainerStyle: {
          ...inputContainerStyle,
          ...this.props.inputContainerStyle
        },
        labelStyle: {
          ...labelStyle,
          ...this.props.labelStyle
        },
        iconStyle: {
          ...iconStyle,
          ...this.props.iconStyle
        },
        placeholderTextColor: 'rgba(255, 255, 255, 0.7)'
      }} />
    );
  }
}
