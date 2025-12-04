import React, {Text} from 'react-native';

const TextSegment = ({textSegments, matchStartKey, matchEndKey}) => (
  <Text>
    {textSegments.map((segment, index) => {
      const hasHighlightedBackground =
        index >= matchStartKey && index <= matchEndKey;

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
              backgroundColor: hasHighlightedBackground
                ? 'yellow'
                : 'transparent',
            },
          ]}>
          {segment.text}
        </Text>
      );
    })}
  </Text>
);

export default TextSegment;
