import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';
import HighlightTextZone from './HighlightTextZone';
import useData from '../context/Data/useData';
import DifficultSentenceContentHeader from './DifficultSentenceContentHeader';
import DifficultSentenceTopHeaderActions from './DifficultSentenceTopHeaderActions';
import AreYouSureSection from './AreYouSureSection';

const DifficultSentenceContent = ({
  topic,
  isCore,
  targetLang,
  baseLang,
  dueText,
  setShowReviewSettings,
  dueColorState,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  sentenceId,
  updateSentenceData,
  sentence,
  navigation,
  handleClose,
  handleYesSure,
  showReviewSettings,
  handleShowAllMatchedWords,
  safeTextFunc,
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const {saveWordFirebase} = useData();

  const isDueNow =
    sentence?.nextReview || new Date(sentence.reviewData.due) < new Date();

  const highlightMode = sentenceId === sentenceBeingHighlightedState;
  const isSentenceHelper = sentence?.isSentenceHelper;

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

  const handleNavigation = () => {
    if (!isSentenceHelper) {
      navigation.navigate('ContentScreen', {
        selectedTopicIndex: sentence.contentIndex,
        targetSentenceId: sentenceId,
      });
    }
  };

  const handleSaveWordToFB = ({
    highlightedWord,
    highlightedWordSentenceId,
    isGoogle,
  }) => {
    saveWordFirebase({
      highlightedWord,
      highlightedWordSentenceId,
      contextSentence: targetLang,
      isGoogle,
    });
    setSentenceBeingHighlightedState('');
  };

  return (
    <>
      <DifficultSentenceContentHeader
        topic={topic}
        dueColorState={dueColorState}
        isCore={isCore}
        dueText={dueText}
        handleNavigation={handleNavigation}
      />
      <DifficultSentenceTopHeaderActions
        isDueNow={isDueNow}
        updateSentenceData={updateSentenceData}
        sentence={sentence}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        handleSettingHighlightmode={handleSettingHighlightmode}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        handleCopyText={handleCopyText}
        handleOpenGoogleTranslate={handleOpenGoogleTranslate}
        setHighlightedIndices={setHighlightedIndices}
        setShowReviewSettings={setShowReviewSettings}
        handleShowWords={handleShowAllMatchedWords}
      />
      {showReviewSettings ? (
        <AreYouSureSection
          handleClose={handleClose}
          handleYesSure={handleYesSure}
        />
      ) : null}
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
        safeTextFunc(targetLang)
      )}
      <View>
        <Text>{baseLang}</Text>
      </View>
    </>
  );
};

export default DifficultSentenceContent;
