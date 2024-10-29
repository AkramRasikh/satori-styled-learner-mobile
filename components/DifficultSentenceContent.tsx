import {Text, TouchableOpacity, View} from 'react-native';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';
import HighlightTextZone from './HighlightTextZone';
import {useState} from 'react';
import useData from '../context/Data/useData';
import SRSTogglesMini from './SRSTogglesMini';

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
  onLongPress,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  sentenceId,
  updateSentenceData,
  sentence,
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const {saveWordFirebase} = useData();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });
  const isDueNow =
    sentence?.nextReview || new Date(sentence.reviewData.due) < new Date();

  const highlightMode = sentenceId === sentenceBeingHighlightedState;

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleCopyText = () => {
    Clipboard.setString(targetLang);
  };

  const handleLayout = event => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleSettingHighlightmode = () => {
    if (sentenceId === sentenceBeingHighlightedState) {
      setSentenceBeingHighlightedState('');
    } else {
      setSentenceBeingHighlightedState(sentenceId);
    }
  };

  const handleOpenGoogleTranslate = () => {
    openGoogleTranslateApp(targetLang);
  };

  const handleSaveWordToFB = ({highlightedWord, highlightedWordSentenceId}) => {
    saveWordFirebase({
      highlightedWord,
      highlightedWordSentenceId,
      contextSentence: targetLang,
    });
    setSentenceBeingHighlightedState('');
  };

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return textSegments.map((segment, index) => {
      return (
        <>
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
            ]}
            onLongPress={() => onLongPress(segment.text)}>
            {segment.text}
          </Text>
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
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          justifyContent: isDueNow ? 'space-between' : 'flex-end',
        }}>
        {isDueNow ? (
          <SRSTogglesMini
            sentence={sentence}
            updateSentenceData={updateSentenceData}
          />
        ) : null}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            marginVertical: 'auto',
          }}>
          {sentenceId !== sentenceBeingHighlightedState ? (
            <TouchableOpacity onPress={handleSettingHighlightmode}>
              <Text>🖌️</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setSentenceBeingHighlightedState('')}>
              <Text>❌</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleCopyText}>
            <Text>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenGoogleTranslate}>
            <Text>📚</Text>
          </TouchableOpacity>
        </View>
      </View>
      {highlightMode ? (
        <View
          onLayout={handleLayout} // Attach the onLayout event handler
        >
          <HighlightTextZone
            id={sentenceId}
            sentenceIndex={0}
            text={targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={handleSaveWordToFB}
            setHighlightMode={() => {}}
            textWidth={containerWidth}
          />
        </View>
      ) : (
        <Text>{getSafeText(targetLang)}</Text>
      )}
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
