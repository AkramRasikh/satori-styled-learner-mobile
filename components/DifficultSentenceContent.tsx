import {Text, TouchableOpacity, View} from 'react-native';

const DueColorMarker = ({dueColorState}) => (
  <View
    style={{
      backgroundColor: dueColorState,
      width: 16,
      height: 16,
      borderRadius: 10,
      marginVertical: 'auto',
    }}
  />
);

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
        <DueColorMarker dueColorState={dueColorState} />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Text
            style={{
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            {topic} {isCore ? '🧠' : ''}
          </Text>
          <TouchableOpacity
            onPress={() => setShowReviewSettings(!showReviewSettings)}>
            <Text>{dueText} 😓</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text selectable={true}>{targetLang}</Text>
      </View>
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
