import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#74dcd9',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator
          color="#fff"
          size="large"
        />
      </View>
    );
  }
}
