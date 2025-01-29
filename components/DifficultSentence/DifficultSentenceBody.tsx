import React, {View} from 'react-native';
import {useEffect, useState} from 'react';
import DifficultSentenceTextContainer from './DifficultSentenceTextContainer';
import {getDueDateText} from '../../utils/get-date-due-status';
import useData from '../../context/Data/useData';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import {checkOverlap} from '../../utils/check-word-overlap';
import DifficultSentenceTitleAndStatus from './DifficultSentenceTitleAndStatus';
import DifficultSentenceActions from './DifficultSentenceActions';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from '../useOpenGoogleTranslate';
import AreYouSureSection from '../AreYouSureSection';
import DifficultSentenceAudioContainer from './DifficultSentenceAudioContainer';
import TextSegment from '../TextSegment';
import DifficultSentenceMappedWords from './DifficultSentenceMappedWords';
import TextSegmentContainer from '../TextSegmentContainer';

const DifficultSentenceWidget = ({
  sentence,
  updateSentenceData,
  dueStatus,
  addSnippet,
  removeSnippet,
  pureWords,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  dueDate,
  navigation,
  indexNum,
  handleSelectWord,
  handleWordUpdate,
  deleteWord,
}) => {
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {getThisSentencesWordList} = useData();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const numberOfWords = pureWords.length;

  const handleShowAllMatchedWords = () => {
    setShowAllMatchedWordsState(!showAllMatchedWordsState);
  };

  const handleUpdateWordFinal = wordData => {
    handleWordUpdate(wordData);
    const updatedMatchedWordListState = matchedWordListState.map(item => {
      if (item.id === wordData.wordId) {
        return {
          ...item,
          ...wordData.fieldToUpdate,
        };
      }
      return item;
    });
    setMatchedWordListState(updatedMatchedWordListState);
  };

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(targetLang).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [numberOfWords]);

  const handleDeleteContent = () => {
    updateSentenceData({
      isAdhoc: sentence?.isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        nextReview: null,
        reviewHistory: null,
      },
      contentIndex: sentence?.contentIndex,
    });
    setShowReviewSettings(false);
  };

  const getSafeTextDefault = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return <TextSegment textSegments={textSegments} />;
  };

  const getSafeText = targetText => {
    if (!showAllMatchedWordsState) {
      return getSafeTextDefault(targetLang);
    }

    const textSegments = underlineWordsInSentence(targetText);
    const wordsInOverlapCheck = checkOverlap(matchedWordListState);
    return (
      <TextSegmentContainer
        textSegments={textSegments}
        wordsInOverlapCheck={wordsInOverlapCheck}
        matchedWordListState={matchedWordListState}
      />
    );
  };

  const handleNavigation = () => {
    const isSentenceHelper = sentence?.isSentenceHelper;

    if (!isSentenceHelper) {
      navigation.navigate('ContentScreen', {
        selectedTopicIndex: sentence.contentIndex,
        targetSentenceId: sentence.id,
      });
    }
  };

  const handleSettingHighlightmode = () => {
    if (sentence.id === sentenceBeingHighlightedState) {
      setSentenceBeingHighlightedState('');
    } else {
      setSentenceBeingHighlightedState(sentence.id);
    }
  };

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogleTranslate = () => {
    openGoogleTranslateApp(targetLang);
  };

  const {dueColorState} = getDueDateText(dueStatus);

  const handleCopyText = () => {
    Clipboard.setString(targetLang);
  };
  const isDueNow =
    sentence?.nextReview || new Date(sentence.reviewData.due) < new Date();

  const showMatchedWordsKey =
    matchedWordListState?.length > 0 && showAllMatchedWordsState;

  return (
    <View
      style={{
        gap: 10,
        marginBottom: 10,
      }}>
      <DifficultSentenceTitleAndStatus
        topic={topic}
        dueColorState={dueColorState}
        isCore={isCore}
        dueText={dueDate}
        handleNavigation={handleNavigation}
      />
      <DifficultSentenceActions
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
          handleClose={() => setShowReviewSettings(false)}
          handleYesSure={handleDeleteContent}
        />
      ) : null}
      <DifficultSentenceTextContainer
        targetLang={targetLang}
        baseLang={baseLang}
        sentenceId={id}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        safeTextFunc={getSafeText}
        highlightedIndices={highlightedIndices}
        setHighlightedIndices={setHighlightedIndices}
      />
      <DifficultSentenceAudioContainer
        sentence={sentence}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        indexNum={indexNum}
      />
      {showMatchedWordsKey &&
        matchedWordListState.map((item, index) => {
          return (
            <DifficultSentenceMappedWords
              key={index}
              item={item}
              handleSelectWord={handleSelectWord}
              deleteWord={deleteWord}
              handleUpdateWordFinal={handleUpdateWordFinal}
              indexNum={index}
            />
          );
        })}
    </View>
  );
};

export default DifficultSentenceWidget;
