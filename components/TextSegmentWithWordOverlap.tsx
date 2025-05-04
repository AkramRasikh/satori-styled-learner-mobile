import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {getHexCode} from '../utils/get-hex-code';

const TextSegmentWithWordOverlap = ({
  segment,
  nestedCoordinates,
  colorIndex,
}) => {
  const [textWidth, setTextWidth] = useState(0);

  return (
    <View
      style={{
        height: 32,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          maxWidth: textWidth,
        }}>
        {nestedCoordinates.map(item => {
          return (
            <Text
              key={item}
              style={{
                color: getHexCode(item),
                fontSize: 8,
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              ({item + 1})
            </Text>
          );
        })}
      </View>
      <Text
        style={{
          ...segment.style,
          fontSize: 20,
          lineHeight: 24,
          color: getHexCode(colorIndex),
        }}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setTextWidth(width);
        }}>
        {segment.text}
      </Text>
    </View>
  );
};

export default TextSegmentWithWordOverlap;
