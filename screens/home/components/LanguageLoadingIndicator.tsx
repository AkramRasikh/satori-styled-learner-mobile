import React from 'react';
import {ActivityIndicator} from 'react-native-paper';

const LanguageLoadingIndicator = () => (
  <ActivityIndicator
    style={{
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 100,
      top: '50%',
    }}
    size="large"
  />
);

export default LanguageLoadingIndicator;
