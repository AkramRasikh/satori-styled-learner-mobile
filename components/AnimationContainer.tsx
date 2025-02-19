import React from 'react';
import {Animated} from 'react-native';

const AnimationContainer = ({fadeAnim, scaleAnim, styles, children}) => (
  <Animated.View
    style={{
      opacity: fadeAnim,
      transform: [{scale: scaleAnim}],
      ...styles,
    }}>
    {children}
  </Animated.View>
);

export default AnimationContainer;
