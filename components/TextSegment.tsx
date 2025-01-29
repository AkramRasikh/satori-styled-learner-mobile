import React, {Text} from 'react-native';

const TextSegment = ({textSegments}) => (
  <Text>
    {textSegments.map((segment, index) => (
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
    ))}
  </Text>
);

export default TextSegment;
