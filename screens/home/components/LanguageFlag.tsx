import React from 'react';
import {Text} from 'react-native-paper';

const LanguageFlag = ({text}) => (
  <Text
    style={{
      fontSize: 35,
      shadowOffset: {
        width: 3,
        height: 3,
      },
      shadowOpacity: 0.3,
    }}>
    {text}
  </Text>
);

export default LanguageFlag;
