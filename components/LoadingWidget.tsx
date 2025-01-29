import React from 'react';
import {Text, View} from 'react-native';

const LoadingWidget = () => (
  <View
    style={{
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      right: '50%',
      top: '50%',
      opacity: 1,
      zIndex: 100,
    }}>
    <Text
      style={{
        fontSize: 30,
      }}>
      ⏳
    </Text>
  </View>
);

export default LoadingWidget;
