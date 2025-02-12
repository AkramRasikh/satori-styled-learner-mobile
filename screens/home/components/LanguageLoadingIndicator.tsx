import React from 'react';
import {View} from 'react-native';
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

export const LoadingContainer = ({children, isLoadingLanguageState}) => (
  <View
    style={{
      opacity: isLoadingLanguageState ? 0.5 : 1,
      gap: 10,
      marginBottom: 20,
    }}>
    {children}
  </View>
);

export default LanguageLoadingIndicator;
