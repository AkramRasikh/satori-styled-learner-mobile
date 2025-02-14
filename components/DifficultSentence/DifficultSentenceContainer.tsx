import React, {View} from 'react-native';
import {useEffect, useState} from 'react';
import DifficultSentenceTopHeader from './DifficultSentenceTopHeader';
import DifficultSentenceTextContainer from './DifficultSentenceTextContainer';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import {DefaultTheme, Button, Text} from 'react-native-paper';
import DifficultSentenceMappedWords from './DifficultSentenceMappedWords';
import TextSegmentContainer from '../TextSegmentContainer';
import {checkOverlap} from '../../utils/check-word-overlap';

import {
  calculateDueDate,
  getDueDateText,
} from '../../utils/get-date-due-status';
import {isCardDue} from '../../utils/is-card-due';
import DifficultSentenceSRSToggles from './DifficultSentenceSRSToggles';
import DifficultSentenceAudioControls from './DifficultSentenceAudioControls';
import DifficultSentenceProgressBar from './DifficultSentenceProgressBar';
import DifficultSentenceTextAction from './DifficultSentenceTextAction';
import useDifficultSentenceAudio from './context/useDifficultSentenceAudio';
import {DifficultSentenceAudioProvider} from './context/DifficultSentenceAudioProvider';
import AnimationContainer from '../AnimationContainer';
import useDifficultSentenceContext from './context/useDifficultSentence';
import DifficultSentenceSnippet from './DifficultSentenceSnippet';

const DifficultSentenceMidSection = ({
  handleSettingHighlightmode,
  handleShowAllMatchedWords,
  sentenceBeingHighlightedState,
  sentence,
  addSnippet,
  removeSnippet,
}) => {
  const {
    isPlaying,
    setIsPlaying,
    soundRef,
    isLoaded,
    miniSnippets,
    setMiniSnippets,
    currentTimeState,
    soundDuration,
    handleLoad,
    handleSnippet,
  } = useDifficultSentenceAudio();

  const hasSnippets = isLoaded && miniSnippets.length > 0;

  return (
    <>
      <DifficultSentenceProgressBar
        currentTimeState={currentTimeState}
        soundDuration={soundDuration}
        isLoaded={isLoaded}
      />
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <DifficultSentenceTextAction
          handleSettingHighlightmode={handleSettingHighlightmode}
          handleShowAllMatchedWords={handleShowAllMatchedWords}
          isBeingHighlighed={sentenceBeingHighlightedState === sentence.id}
        />
        <View
          style={{
            backgroundColor: DefaultTheme.colors?.backdrop,
            width: 1,
            borderRadius: 5,
          }}
        />
        <DifficultSentenceAudioControls
          sentence={sentence}
          handleLoad={handleLoad}
          isLoaded={isLoaded}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          soundRef={soundRef}
          handleSnippet={handleSnippet}
        />
      </View>
      {hasSnippets &&
        miniSnippets.map((snippetData, index) => {
          return (
            <DifficultSentenceSnippet
              key={snippetData.id}
              index={index}
              soundRef={soundRef}
              snippet={snippetData}
              currentTimeState={currentTimeState}
              masterAudio={isPlaying}
              setMasterAudio={setIsPlaying}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              setMiniSnippets={setMiniSnippets}
            />
          );
        })}
    </>
  );
};

const DifficultSentenceContainer = ({
  toggleableSentencesStateLength,
  indexNum,
  sliceArrState,
  sentence,
  navigation,
  realCapacity,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  handleSelectWord,
  handleWordUpdate,
  setSliceArrState,
}) => {
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);

  const handleShowAllMatchedWords = () => {
    setShowAllMatchedWordsState(!showAllMatchedWordsState);
  };
  const {
    pureWords,
    saveWordFirebase,
    deleteWord,
    addSnippet,
    removeSnippet,
    getThisSentencesWordList,
    updatingSentenceState,
  } = useData();

  const {fadeAnim, scaleAnim, matchedWordListState, setMatchedWordListState} =
    useDifficultSentenceContext();

  const isLastEl = toggleableSentencesStateLength === indexNum + 1;
  const isFirst = 0 === indexNum;
  const isLastInTotalOrder = realCapacity === indexNum + 1;
  const numberOfWords = pureWords.length;

  const moreToLoad = sliceArrState === indexNum + 1 && !isLastInTotalOrder;

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(sentence.targetLang).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [numberOfWords]);

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const handleSettingHighlightmode = () => {
    if (sentence.id === sentenceBeingHighlightedState) {
      setSentenceBeingHighlightedState('');
    } else {
      setSentenceBeingHighlightedState(sentence.id);
    }
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

  const thisSentenceIsLoading = updatingSentenceState === sentence.id;
  const showMatchedWordsKey =
    matchedWordListState?.length > 0 && showAllMatchedWordsState;

  const topic = sentence.topic;

  const reviewCardDue = sentence.reviewData?.due;

  const timeNow = new Date();

  const isDueState = reviewCardDue
    ? isCardDue({cardDate: new Date(reviewCardDue), nowDate: timeNow})
    : false;

  const {dueColorState, text} = getDueDateText(
    calculateDueDate({
      todayDateObj: timeNow,
      nextReview: sentence.reviewData.due,
    }),
  );

  const getSafeTextDefault = (targetText: string) => {
    const textSegments = underlineWordsInSentence(targetText);
    return <TextSegment textSegments={textSegments} />;
  };

  const getSafeText = (targetText: string) => {
    if (!showAllMatchedWordsState) {
      return getSafeTextDefault(sentence.targetLang);
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

  return (
    <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
      <View
        style={{
          paddingBottom: isLastEl ? 100 : 0,
          paddingTop: !isFirst ? 70 : 0,
          opacity: thisSentenceIsLoading ? 0.5 : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
        <DifficultSentenceTopHeader
          topic={topic}
          dueColorState={dueColorState}
          handleNavigateToTopic={handleNavigation}
        />
        <DifficultSentenceTextContainer
          targetLang={sentence.targetLang}
          baseLang={sentence.baseLang}
          sentenceBeingHighlightedState={sentenceBeingHighlightedState}
          setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
          sentenceId={sentence.id}
          safeTextFunc={getSafeText}
          saveWordFirebase={saveWordFirebase}
        />
        {isDueState ? (
          <DifficultSentenceSRSToggles reviewData={sentence.reviewData} />
        ) : (
          <View style={{alignSelf: 'center'}}>
            <Text style={DefaultTheme.fonts.bodyMedium}>{text}</Text>
          </View>
        )}

        <DifficultSentenceAudioProvider sentence={sentence} indexNum={indexNum}>
          <DifficultSentenceMidSection
            handleSettingHighlightmode={handleSettingHighlightmode}
            handleShowAllMatchedWords={handleShowAllMatchedWords}
            sentenceBeingHighlightedState={sentenceBeingHighlightedState}
            sentence={sentence}
            addSnippet={addSnippet}
            removeSnippet={removeSnippet}
          />
        </DifficultSentenceAudioProvider>
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
        {moreToLoad && (
          <Button
            mode="elevated"
            onPress={() => setSliceArrState(prev => prev + 5)}
            style={{
              alignSelf: 'center',
            }}>
            Load more
          </Button>
        )}
      </View>
    </AnimationContainer>
  );
};

export default DifficultSentenceContainer;
