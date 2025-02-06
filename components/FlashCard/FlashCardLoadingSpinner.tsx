import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

const FlashCardLoadingSpinner = () => (
  <View
    style={{
      margin: 10,
      alignItems: 'center',
      width: '100%',
    }}>
    <ActivityIndicator size="large" />
  </View>
);

export default FlashCardLoadingSpinner;
