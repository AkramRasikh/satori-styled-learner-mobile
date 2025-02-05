import React from 'react';
import {Animated} from 'react-native';

const AnimationContainer = ({fadeAnim, scaleAnim, children}) => (
  <Animated.View
    style={{
      opacity: fadeAnim,
      transform: [{scale: scaleAnim}],
    }}>
    {children}
  </Animated.View>
);

export default AnimationContainer;
