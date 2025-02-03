import React, {View} from 'react-native';
import {useEffect, useState} from 'react';
import TopHeader from './TopHeader';
import DifficultSentenceTextContainer from '../DifficultSentence/DifficultSentenceTextContainer';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import {
  NewAudioControls,
  NewProgressBarComponent,
  NewSRSToggles,
  TextActionContainer,
} from '.';
import {DefaultTheme, Button} from 'react-native-paper';
import DifficultSentenceMappedWords from '../DifficultSentence/DifficultSentenceMappedWords';
import TextSegmentContainer from '../TextSegmentContainer';
import {checkOverlap} from '../../utils/check-word-overlap';
import DifficultSentenceSnippets from '../DifficultSentence/DifficultSentenceSnippets';
import useDifficultSentenceContext from './context/useDifficultSentence';

const NewDifficultSentenceContainer = ({
  toggleableSentencesStateLength,
  indexNum,
  sliceArrState,
  sentence,
  updatingSentenceState,
  navigation,
  realCapacity,
  addSnippet,
  removeSnippet,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  handleSelectWord,
  handleWordUpdate,
  setSliceArrState,
  // handleClickDelete,
}) => {
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);

  const handleShowAllMatchedWords = () => {
    setShowAllMatchedWordsState(!showAllMatchedWordsState);
  };
  const {pureWords, saveWordFirebase, deleteWord, getThisSentencesWordList} =
    useData();

  const {
    soundRef,
    isLoaded,
    miniSnippets,
    setMiniSnippets,
    setCurrentTimeState,
    currentTimeState,
    isPlaying,
    setIsPlaying,
  } = useDifficultSentenceContext();

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

  const getSafeTextDefault = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return <TextSegment textSegments={textSegments} />;
  };

  const getSafeText = targetText => {
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
    <View
      style={{
        paddingBottom: isLastEl ? 100 : 0,
        paddingTop: !isFirst ? 70 : 0,
        opacity: thisSentenceIsLoading ? 0.5 : 1,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          marginBottom: 20,
        }}>
        <TopHeader
          topic={topic}
          dueColorState={'#FFBF00'}
          handleNavigateToTopic={handleNavigation}
        />
        <DifficultSentenceTextContainer
          targetLang={sentence.targetLang}
          baseLang={sentence.baseLang}
          sentenceBeingHighlightedState={sentenceBeingHighlightedState}
          setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
          sentenceId={sentence.id}
          safeTextFunc={getSafeText}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
          saveWordFirebase={saveWordFirebase}
        />
        <NewSRSToggles sentence={sentence} />
        <NewProgressBarComponent />
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <TextActionContainer
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
          <NewAudioControls sentence={sentence} />
        </View>
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
      {miniSnippets?.length > 0 && (
        <DifficultSentenceSnippets
          isLoaded={isLoaded}
          soundRef={soundRef}
          snippetsLocalAndDb={miniSnippets}
          setCurrentTimeState={setCurrentTimeState}
          currentTimeState={currentTimeState}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          addSnippet={addSnippet}
          removeSnippet={removeSnippet}
          setMiniSnippets={setMiniSnippets}
          url={sentence.url}
        />
      )}
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
  );
};

export default NewDifficultSentenceContainer;

// {thisSentenceIsLoading && <LoadingWidget />}
// <DifficultSentenceBody
//   sentence={sentence}
//   updateSentenceData={updateSentenceData}
//   dueStatus={dueStatus}
//   dueDate={dueDate}
//   addSnippet={addSnippet}
//   removeSnippet={removeSnippet}
//   sentenceBeingHighlightedState={sentenceBeingHighlightedState}
//   setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
//   navigation={navigation}
//   handleSelectWord={handleSelectWord}
//   handleWordUpdate={handleWordUpdate}
//   deleteWord={deleteWord}
//   indexNum={indexNum}
// />
// {moreToLoad && (
//   <Button
//     onPress={() => setSliceArrState(prev => prev + 5)}
//     title="See More"
//   />
// )}
