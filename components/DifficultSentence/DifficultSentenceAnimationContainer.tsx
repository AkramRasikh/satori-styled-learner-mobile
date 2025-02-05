import React from 'react';
import {Animated} from 'react-native';
import useDifficultSentenceContext from './context/useDifficultSentence';

const CollapsibleCard = ({children}) => {
  const {fadeAnim, scaleAnim} = useDifficultSentenceContext();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{scale: scaleAnim}],
      }}>
      {children}
    </Animated.View>
  );
};

export default CollapsibleCard;
