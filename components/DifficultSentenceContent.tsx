import {Text, View} from 'react-native';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';
import HighlightTextZone from './HighlightTextZone';
import {useState} from 'react';
import useData from '../context/Data/useData';
import DifficultSentenceContentHeader from './DifficultSentenceContentHeader';
import DifficultSentenceTopHeaderActions from './DifficultSentenceTopHeaderActions';

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
  setToggleableSentencesState,
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
      <DifficultSentenceTopHeaderActions
        isDueNow={isDueNow}
        updateSentenceData={updateSentenceData}
        setToggleableSentencesState={setToggleableSentencesState}
        sentence={sentence}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        handleSettingHighlightmode={handleSettingHighlightmode}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        handleCopyText={handleCopyText}
        handleOpenGoogleTranslate={handleOpenGoogleTranslate}
      />
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
