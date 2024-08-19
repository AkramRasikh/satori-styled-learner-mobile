import {Text, TouchableOpacity, View} from 'react-native';

const DifficultSentenceContent = ({
  topic,
  isCore,
  targetLang,
  baseLang,
  dueText,
  setShowReviewSettings,
  showReviewSettings,
  dueColorState,
}) => {
  return (
    <>
      <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
        <View
          style={{
            backgroundColor: dueColorState,
            width: 16,
            height: 16,
            borderRadius: 10,
            marginVertical: 'auto',
          }}
        />
        <Text
          style={{
            fontStyle: 'italic',
            textDecorationLine: 'underline',
          }}>
          {topic} {isCore ? '🧠' : ''}
        </Text>
      </View>
      <View>
        <Text>{targetLang}</Text>
      </View>
      <View>
        <Text>{baseLang}</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => setShowReviewSettings(!showReviewSettings)}>
          <Text>{dueText} 😓</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
