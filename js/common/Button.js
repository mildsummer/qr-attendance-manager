import React, { PureComponent } from 'react';
import { Button } from 'react-native-elements';

const containerStyle = {
  width: '100%',
  maxWidth: 250
};

const buttonStyle = {
  minHeight: 40,
  backgroundColor: '#fff',
  borderRadius: 25,
  paddingTop: 7
};

const titleStyle = {
  color: '#74dcd9',
  fontWeight: '500'
};

export default class CustomInput extends PureComponent {
  render() {
    return (
      <Button {...{
        ...this.props,
        containerStyle: {
          ...containerStyle,
          ...this.props.containerStyle
        },
        buttonStyle : {
          ...buttonStyle,
          ...this.props.buttonStyle
        },
        titleStyle: {
          ...titleStyle,
          ...this.props.titleStyle
        },
        disabledStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        },
        disabledTitleStyle: {
          color: '#74dcd9'
        },
        loadingProps: {
          color: '#74dcd9'
        }
      }} />
    );
  }
}
