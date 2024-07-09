import {Text} from 'react-native';

const SafeTextComponent = ({
  underlineWordsInSentence,
  targetText,
  onLongPress,
}) => {
  const textSegments = underlineWordsInSentence(targetText);

  return textSegments.map((segment, index) => {
    return (
      <Text
        key={index}
        id={segment.id}
        style={[segment.style]}
        onLongPress={() => onLongPress(segment.text)}>
        {segment.text}
      </Text>
    );
  });
};

export default SafeTextComponent;
