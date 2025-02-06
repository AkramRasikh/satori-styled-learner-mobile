import React from 'react';
import {Text, View} from 'react-native';
import {ActivityIndicator, DefaultTheme, MD2Colors} from 'react-native-paper';

const LoadingScreen = ({children}): React.JSX.Element => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator
        animating={true}
        color={MD2Colors.amber600}
        size={'large'}
      />
      <Text style={{...DefaultTheme.fonts.headlineLarge, fontStyle: 'italic'}}>
        {children}
      </Text>
    </View>
  );
};

export default LoadingScreen;
