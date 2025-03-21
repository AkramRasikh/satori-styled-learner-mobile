import React, {View} from 'react-native';
import {useEffect, useState} from 'react';
import DifficultSentenceTopHeader from './DifficultSentenceTopHeader';
import DifficultSentenceTextContainer from './DifficultSentenceTextContainer';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import {
  DefaultTheme,
  Button,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
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
import {DoubleClickButton} from '../Button';
import SentenceBreakdown from '../SentenceBreakdown';
import {getHexCode} from '../../utils/get-hex-code';
import {translateText} from '../../api/google-translate';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';

const DifficultSentenceMidSection = ({sentence, addSnippet, removeSnippet}) => {
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
    setCurrentTimeState,
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
        <DifficultSentenceTextAction />
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
              setCurrentTimeState={setCurrentTimeState}
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
  handleSelectWord,
  handleWordUpdate,
  setSliceArrState,
  underlineWordsInSentence,
  combineWordsListState,
  setCombineWordsListState,
}) => {
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);
  const [isHighlightMode, setHighlightMode] = useState(false);

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

  const {
    fadeAnim,
    scaleAnim,
    matchedWordListState,
    setMatchedWordListState,
    isTriggeringReview,
    revealSentenceBreakdown,
    quickTranslationArr,
    setQuickTranslationArr,
  } = useDifficultSentenceContext();

  const {languageSelectedState} = useLanguageSelector();

  const isLastEl = toggleableSentencesStateLength === indexNum + 1;
  const isFirst = 0 === indexNum;
  const isLastInTotalOrder = realCapacity === indexNum + 1;
  const numberOfWords = pureWords.length;

  const moreToLoad = sliceArrState === indexNum + 1 && !isLastInTotalOrder;

  const hasQuickTranslation = quickTranslationArr.length > 0;

  const handleQuickGoogleTranslate = async text => {
    const result = await translateText({
      text,
      language: languageSelectedState,
    });
    setQuickTranslationArr(prev => [...prev, result]);
  };

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(sentence.targetLang).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [numberOfWords]);

  const handleSettingHighlightmode = () => {
    setHighlightMode(!isHighlightMode);
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
    return (
      <DoubleClickButton
        onLongPress={
          matchedWordListState?.length > 0
            ? () => handleShowAllMatchedWords()
            : () => {}
        }
        onPress={handleSettingHighlightmode}>
        <TextSegment textSegments={textSegments} />
      </DoubleClickButton>
    );
  };

  const getSafeText = (targetText: string) => {
    if (revealSentenceBreakdown) {
      const vocabBreakDoownWithHexCode = revealSentenceBreakdown
        ? sentence.vocab.map((i, index) => {
            return {
              ...i,
              color: getHexCode(index),
            };
          })
        : null;
      return (
        <Text style={{fontSize: 20}}>
          {vocabBreakDoownWithHexCode.map((nestedSegment, index) => (
            <Text key={index} style={{color: nestedSegment.color}}>
              {nestedSegment.surfaceForm}
            </Text>
          ))}
        </Text>
      );
    } else if (!showAllMatchedWordsState) {
      return getSafeTextDefault(sentence.targetLang);
    }

    const textSegments = underlineWordsInSentence(targetText);
    const wordsInOverlapCheck = checkOverlap(matchedWordListState);
    return (
      <DoubleClickButton
        onLongPress={handleShowAllMatchedWords}
        onPress={handleSettingHighlightmode}>
        <TextSegmentContainer
          textSegments={textSegments}
          wordsInOverlapCheck={wordsInOverlapCheck}
          matchedWordListState={matchedWordListState}
        />
      </DoubleClickButton>
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
    <View>
      {isTriggeringReview && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '30%',
            zIndex: 100,
          }}
          size="large"
        />
      )}
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
            sentenceId={sentence.id}
            safeTextFunc={getSafeText}
            saveWordFirebase={saveWordFirebase}
            isHighlightMode={isHighlightMode}
            setHighlightMode={setHighlightMode}
            handleQuickGoogleTranslate={handleQuickGoogleTranslate}
          />
          {isDueState ? (
            <DifficultSentenceSRSToggles reviewData={sentence.reviewData} />
          ) : (
            <View style={{alignSelf: 'center'}}>
              <Text style={DefaultTheme.fonts.bodyMedium}>{text}</Text>
            </View>
          )}
          {hasQuickTranslation && (
            <View style={{gap: 5, marginVertical: 5}}>
              {quickTranslationArr.map((item, key) => {
                const countNumber = key + 1 + ') ';
                return (
                  <View key={key}>
                    <Text>
                      {countNumber}
                      {item.text}, {item.transliteration}, {item.translation}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
          {revealSentenceBreakdown && (
            <SentenceBreakdown
              vocab={sentence.vocab}
              meaning={sentence.meaning}
              sentenceStructure={sentence.sentenceStructure}
            />
          )}

          <DifficultSentenceAudioProvider
            sentence={sentence}
            indexNum={indexNum}>
            <DifficultSentenceMidSection
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
                  combineWordsListState={combineWordsListState}
                  setCombineWordsListState={setCombineWordsListState}
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
    </View>
  );
};

export default DifficultSentenceContainer;
