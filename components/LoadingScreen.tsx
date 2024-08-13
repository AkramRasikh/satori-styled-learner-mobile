import React from 'react';
import {Text, View} from 'react-native';

const LoadingScreen = ({children}): React.JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontStyle: 'italic', fontSize: 30, fontWeight: 'bold'}}>
        {children}
      </Text>
    </View>
  );
};

export default LoadingScreen;
