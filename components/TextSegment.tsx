import React, {Text} from 'react-native';

const TextSegment = ({textSegments}) => {
  return (
    <Text>
      {textSegments.map((segment, index) => {
        return (
          <Text
            key={index}
            id={segment.id}
            selectable={true}
            style={[
              segment.style,
              {
                fontSize: 20,
                lineHeight: 24,
              },
            ]}>
            {segment.text}
          </Text>
        );
      })}
    </Text>
  );
};

export default TextSegment;
