import React, {View} from 'react-native';
import {Text} from 'react-native-paper';

const HighlightTextHover = ({getHighlightedText}) => (
  <View
    style={{
      position: 'absolute',
      bottom: 100,
      backgroundColor: '#FFFFC5',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      alignSelf: 'center',
    }}>
    <Text style={{fontSize: 20}}>{getHighlightedText()}</Text>
  </View>
);

export default HighlightTextHover;
