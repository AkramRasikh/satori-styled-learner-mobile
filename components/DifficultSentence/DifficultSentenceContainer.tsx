import React, {Animated, Easing, PanResponder, View} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import DifficultSentenceTopHeader from './DifficultSentenceTopHeader';
import DifficultSentenceTextContainer from './DifficultSentenceTextContainer';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import {
  DefaultTheme,
  Button,
  Text,
  ActivityIndicator,
  IconButton,
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
    handleOnLoopSentence,
    isOnLoopState,
    handleThreeSecondLoop,
    isOnThreeSecondLoopState,
  } = useDifficultSentenceAudio();

  const hasSnippets = isLoaded && miniSnippets.length > 0;

  const canBeLooped = Number.isFinite(sentence?.endTime);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      if (!isOnLoopState || !isPlaying) return;
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    };

    spin();
  }, [rotateAnim, isOnLoopState, isPlaying]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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
      {canBeLooped && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {isOnLoopState && isPlaying ? (
            <>
              <DifficultSentenceProgressBar
                currentTimeState={currentTimeState - sentence.time}
                soundDuration={sentence.endTime - sentence.time}
                isLoaded={isLoaded}
                secondary
              />
              <Animated.View style={{transform: [{rotate}]}}>
                <IconButton
                  icon={'repeat'}
                  mode="outlined"
                  size={20}
                  onPress={handleOnLoopSentence}
                  iconColor="green"
                  style={{
                    borderWidth: 1,
                    borderColor: 'green',
                  }}
                />
              </Animated.View>
            </>
          ) : (
            <IconButton
              icon={'repeat'}
              mode="outlined"
              size={20}
              onPress={handleOnLoopSentence}
            />
          )}
          {isPlaying && Number.isFinite(isOnThreeSecondLoopState) ? (
            <>
              <DifficultSentenceProgressBar
                currentTimeState={
                  currentTimeState - (isOnThreeSecondLoopState - 1.5)
                }
                soundDuration={3}
                isLoaded={isLoaded}
                secondary
              />
              <Animated.View style={{transform: [{rotate}]}}>
                <IconButton
                  icon={'timer-3'}
                  mode="outlined"
                  size={20}
                  onPress={handleThreeSecondLoop}
                  iconColor="green"
                  style={{
                    borderWidth: 1,
                    borderColor: 'green',
                  }}
                />
              </Animated.View>
            </>
          ) : (
            <IconButton
              icon={'timer-3'}
              mode="outlined"
              size={20}
              onPress={handleThreeSecondLoop}
            />
          )}
        </View>
      )}
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
  nextAudioIsTheSameUrl,
  getThisTopicsDueSentences,
}) => {
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);
  const [isDeleteReadyState, setIsDeleteReadyState] = useState(false);
  const [isHighlightMode, setHighlightMode] = useState(false);

  const {handleDeleteContent, collapseAnimation} =
    useDifficultSentenceContext();

  useEffect(() => {
    if (isDeleteReadyState) {
      const handleDeleteContentFunc = async () => {
        await collapseAnimation();
        await handleDeleteContent();
      };
      handleDeleteContentFunc();
    }
  }, [isDeleteReadyState, handleDeleteContent]);

  const swipeDistance = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        swipeDistance.current = 0;
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        swipeDistance.current += gestureState.dx; // Accumulate swipe distance
        const distance = Math.abs(gestureState.dx);

        if (distance > 200 && !isHighlightMode) {
          setIsDeleteReadyState(true); // Set state when 50px threshold is reached
        }
      },
    }),
  ).current;

  const spreadHandler = isHighlightMode ? {} : panResponder.panHandlers;

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
      const dueSentences = getThisTopicsDueSentences(sentence.topic);
      navigation.navigate('ContentScreen', {
        selectedTopicIndex: sentence.contentIndex,
        targetSentenceId: sentence.id,
        dueSentences: dueSentences,
      });
    }
  };

  const handleSaveWordInBreakdown = async ({
    surfaceForm,
    meaning,
    isGoogle,
  }) => {
    await saveWordFirebase({
      highlightedWord: surfaceForm,
      highlightedWordSentenceId: sentence.id,
      contextSentence: sentence.targetLang,
      meaning,
      isGoogle,
    });
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
  const textSegments = underlineWordsInSentence(sentence.targetLang);

  const getSafeTextDefault = () => {
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

  const getSafeText = () => {
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
          {vocabBreakDoownWithHexCode.map((nestedSegment, index) => {
            const isLast = vocabBreakDoownWithHexCode.length === index + 1;

            return (
              <Text key={index} style={{color: nestedSegment.color}}>
                {nestedSegment.surfaceForm}
                {!isLast && ' '}
              </Text>
            );
          })}
        </Text>
      );
    } else if (!showAllMatchedWordsState) {
      return getSafeTextDefault(sentence.targetLang);
    }

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
    <View {...spreadHandler}>
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
            previousSentence={sentence.previousSentence}
            baseLang={sentence.baseLang}
            sentenceId={sentence.id}
            safeTextFunc={getSafeText}
            saveWordFirebase={saveWordFirebase}
            isHighlightMode={isHighlightMode}
            setHighlightMode={setHighlightMode}
            handleQuickGoogleTranslate={handleQuickGoogleTranslate}
            notes={sentence.notes}
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
          <DifficultSentenceAudioProvider
            sentence={sentence}
            indexNum={indexNum}
            nextAudioIsTheSameUrl={nextAudioIsTheSameUrl}>
            <DifficultSentenceMidSection
              sentence={sentence}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
            />
          </DifficultSentenceAudioProvider>
          {revealSentenceBreakdown && (
            <SentenceBreakdown
              vocab={sentence.vocab}
              meaning={sentence.meaning}
              sentenceStructure={sentence.sentenceStructure}
              handleSaveWordInBreakdown={handleSaveWordInBreakdown}
              textSegments={textSegments}
            />
          )}
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
