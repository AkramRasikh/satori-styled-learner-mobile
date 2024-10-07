import {Text, TouchableOpacity, View} from 'react-native';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import Clipboard from '@react-native-clipboard/clipboard';

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

export const DifficultSentenceContentHeader = ({
  topic,
  dueColorState,
  isCore,
  dueText,
  setShowReviewSettings,
  showReviewSettings,
}) => {
  return (
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
  );
};

const DifficultSentenceContent = ({
  topic,
  isCore,
  targetLang,
  baseLang,
  dueText,
  setShowReviewSettings,
  showReviewSettings,
  dueColorState,
  pureWords,
  handleOpenModal,
  onLongPress,
}) => {
  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const handleCopyText = () => {
    Clipboard.setString(targetLang);
  };

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    const textSegmentsLength = textSegments.length;
    return textSegments.map((segment, index) => {
      const isLastEl = textSegmentsLength - 1 === index;
      return (
        <>
          <Text
            key={index}
            id={segment.id}
            selectable={true}
            style={[segment.style]}
            // context!!!
            // onLongPress={() => console.log('## segment.text', segment.text)}
            // onLongPress={() => onLongPress(segment.text)}
            onLongPress={() => onLongPress(segment.text)}>
            {segment.text}
          </Text>
          {isLastEl && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={handleOpenModal}>
                <Text>🥸</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyText}>
                <Text>📋</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      );
    });
  };
  return (
    <>
      <DifficultSentenceContentHeader
        topic={topic}
        dueColorState={dueColorState}
        isCore={isCore}
        dueText={dueText}
        showReviewSettings={showReviewSettings}
        setShowReviewSettings={setShowReviewSettings}
      />
      <Text>{getSafeText(targetLang)}</Text>
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
