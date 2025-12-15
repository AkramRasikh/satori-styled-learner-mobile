import React, {useMemo, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  MD2Colors,
  TextInput,
} from 'react-native-paper';
import useAnimation from '../../hooks/useAnimation';
import FlashCardLoadingSpinner from './FlashCardLoadingSpinner';
import FlashCardTopSection from './FlashCardTopSection';
import FlashCardSRSToggles from './FlashCardSRSToggles';
import FlashCardModal from './FlashCardModal';
import FlashCardLoadMoreBtn from './FlashCardLoadMoreBtn';
import FlashCardBodyContainer from './FlashCardBodyContainer';
import AnimationContainer from '../AnimationContainer';
import Clipboard from '@react-native-clipboard/clipboard';
import useData from '../../context/Data/useData';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {characterBasedLanguages} from '../../context/LanguageSelector/LanguageSelectorProvider';

const NestedFlashCard = ({
  fadeAnimNestedModal,
  scaleAnimNestedModal,
  wordData,
  handleCloseModal,
  isJapanese,
}) => {
  const fadeAnim = fadeAnimNestedModal || useRef(new Animated.Value(0)).current;
  const scaleAnim =
    scaleAnimNestedModal || useRef(new Animated.Value(0.8)).current;
  useAnimation({
    fadeAnim,
    scaleAnim,
  });

  return (
    <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
      <FlashCardModal
        wordData={wordData}
        onClose={handleCloseModal}
        isJapanese={isJapanese}
      />
    </AnimationContainer>
  );
};

const FlashCard = ({
  wordData,
  index,
  realCapacity,
  sliceArrState,
  handleDeleteWord,
  handleExpandWordArray,
  selectedDueCardState,
  setSelectedDueCardState,
  scrollViewRef,
  handleAdhocMinimalPairFunc,
  updateWordDataAdditionalFunc,
  handleAddCustomWordPromptFunc,
  combineWordsSentenceDiffSentence,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [isOpenWordOptionsState, setIsOpenWordOptionsState] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isCustomPromptOpenState, setIsCustomPromptOpenState] = useState(false);
  const [customPromptTextState, setCustomPromptTextState] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnimNestedModal = useRef(new Animated.Value(0)).current;
  const scaleAnimNestedModal = useRef(new Animated.Value(0.8)).current;
  const targetRef = useRef(null);
  const {setUpdatePromptState} = useData();
  const {languageSelectedState} = useLanguageSelector();

  const isCharacterBasedLanguage = characterBasedLanguages.includes(
    languageSelectedState,
  );

  const isJapanese = languageSelectedState === 'japanese';

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });
  const {collapseAnimation: collapseAnimationNestedFlashCard} = useAnimation({
    fadeAnim: fadeAnimNestedModal,
    scaleAnim: scaleAnimNestedModal,
  });

  const listTextNumber = index + 1 + ') ';
  const wordId = wordData.id;
  const isSelectedWord = selectedDueCardState?.id === wordId;
  const baseForm = wordData.baseForm;
  const isLastInTotalOrder = realCapacity === index + 1;
  const isCardDue = wordData?.isCardDue;
  const cardReviewButNotDue = !isCardDue && wordData?.reviewData?.due;
  const definition = wordData.definition;

  const moreToLoad = sliceArrState === index + 1 && !isLastInTotalOrder;

  const hideAllTogetherStateMemoized = useMemo(() => {
    if (isCollapsingState) {
      return setTimeout(() => true, 300);
    }
    return false;
  }, [isCollapsingState]);

  const handleCloseModal = async () => {
    await new Promise(resolve => {
      collapseAnimationNestedFlashCard();
      setTimeout(resolve, 100);
    });
    setSelectedDueCardState?.(null);
  };

  const handleCopyText = () => {
    Clipboard.setString(baseForm);
    setUpdatePromptState(`${baseForm} added 📎📋!`);
  };

  const handleSubmitWordPrompt = async () => {
    if (!customPromptTextState) {
      return null;
    }
    try {
      setIsLoadingState(true);
      await handleAddCustomWordPromptFunc({
        inputWord: {id: wordData.id, word: baseForm, definition},
        prompt: customPromptTextState,
      });
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleAdhocWord = async mode => {
    try {
      setIsLoadingState(true);
      await handleAdhocMinimalPairFunc({
        inputWord: {id: wordData.id, word: baseForm, definition},
        mode,
      });
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };
  const combineThisWordWithOthers = async () => {
    try {
      setIsLoadingState(true);
      await combineWordsSentenceDiffSentence({
        inputWords: [{id: wordData.id, word: baseForm, definition}],
      });
    } catch (error) {
      console.log('## combineThisWordWithOthers', error);
    } finally {
      setIsLoadingState(false);
    }
  };

  const collapseAnimationWithState = async () => {
    await collapseAnimation();
    setIsCollapsingState(true);
  };

  const handleDeleteWordWithAnimation = async () => {
    await collapseAnimation();
    setIsCollapsingState(true);
    handleDeleteWord(wordData);
  };

  const scrollToTarget = () => {
    if (targetRef.current && scrollViewRef.current) {
      targetRef.current?.measureLayout(scrollViewRef.current, (_, y) => {
        scrollViewRef.current?.scrollTo({y: y - 100, animated: true});
      });
    }
  };
  const selectWordWithScroll = () => {
    setSelectedDueCardState?.(wordData);
    scrollToTarget();
  };

  const firstExampleSentence =
    wordData.contextData &&
    (wordData.contextData.find(
      item => item?.isSnippetTime && !item?.isPreSnippet,
    ) ||
      wordData.contextData.find(item => item?.isSnippetTime));

  if (hideAllTogetherStateMemoized) {
    return null;
  }
  if (isCollapsingState) {
    return <FlashCardLoadingSpinner />;
  }

  return (
    <>
      <FlashCardBodyContainer
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
        isCardDue={isCardDue}
        isSelectedWord={isSelectedWord}
        cardReviewButNotDue={cardReviewButNotDue}
        targetRef={targetRef}>
        <FlashCardTopSection
          listTextNumber={listTextNumber}
          baseForm={baseForm}
          definiton={definition}
          selectWordWithScroll={selectWordWithScroll}
          isSelectedWord={isSelectedWord}
          handleCloseModal={handleCloseModal}
          setIsOpenWordOptionsState={setIsOpenWordOptionsState}
          isOpenWordOptionsState={isOpenWordOptionsState}
          handleCopyText={handleCopyText}
          firstExampleSentence={firstExampleSentence}
        />
        <Divider bold />
        <FlashCardSRSToggles
          reviewData={wordData.reviewData}
          id={wordId}
          baseForm={baseForm}
          deleteWord={handleDeleteWordWithAnimation}
          collapseAnimation={collapseAnimationWithState}
          definition={definition}
          updateWordDataAdditionalFunc={updateWordDataAdditionalFunc}
        />
        {isSelectedWord && (
          <NestedFlashCard
            fadeAnimNestedModal={fadeAnimNestedModal}
            scaleAnimNestedModal={scaleAnimNestedModal}
            wordData={wordData}
            handleCloseModal={handleCloseModal}
            isJapanese={isJapanese}
          />
        )}

        {isOpenWordOptionsState && (
          <View>
            {isLoadingState && (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: '30%',
                  zIndex: 100,
                }}
              />
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                opacity: isLoadingState ? 0.5 : 1,
              }}>
              <Button
                mode="elevated"
                buttonColor="yellow"
                disabled={isLoadingState}
                onPress={() => handleAdhocWord('any')}>
                any
              </Button>
              <Button
                mode="elevated"
                disabled={isLoadingState}
                onPress={() => handleAdhocWord('antonym')}>
                antonym
              </Button>
              <Button
                mode="elevated"
                disabled={isLoadingState}
                onPress={() => handleAdhocWord('synonym')}>
                synonym
              </Button>
              <Button
                mode="elevated"
                disabled={isLoadingState}
                onPress={() => handleAdhocWord('functional')}>
                functional
              </Button>
              {/* <Button
                    mode="elevated"
                    disabled={isLoadingState}
                    onPress={() => handleAdhocWord('conversation')}>
                    conversation
                  </Button>
                  <Button
                    mode="elevated"
                    disabled={isLoadingState}
                    onPress={() => handleAdhocWord('trivia')}>
                    trivia
                  </Button>
                  <Button
                    mode="elevated"
                    disabled={isLoadingState}
                    onPress={() => handleAdhocWord('rhyme')}>
                    rhyme
                  </Button> */}

              {isCharacterBasedLanguage && (
                <Button
                  mode="elevated"
                  disabled={isLoadingState}
                  onPress={() => handleAdhocWord('seperate')}>
                  seperate 字字
                </Button>
              )}
              {/* <Button
                    buttonColor={MD2Colors.lightBlue300}
                    mode="elevated"
                    disabled={isLoadingState}
                    onPress={() => handleAdhocWord('')}>
                    sound 🎶
                  </Button> */}
              <Button
                buttonColor={MD2Colors.lightBlue300}
                mode="elevated"
                disabled={isLoadingState}
                onPress={combineThisWordWithOthers}>
                combine
              </Button>

              <Button
                buttonColor={MD2Colors.teal500}
                mode="elevated"
                disabled={isLoadingState}
                onPress={() =>
                  setIsCustomPromptOpenState(!isCustomPromptOpenState)
                }>
                Custom
              </Button>
            </View>
            {isCustomPromptOpenState && (
              <View>
                <TextInput
                  label="Prompt"
                  value={customPromptTextState}
                  onChangeText={setCustomPromptTextState}
                  mode="outlined"
                  style={{margin: 5}}
                  multiline
                />
                <Button
                  mode="contained"
                  onPress={handleSubmitWordPrompt}
                  disabled={customPromptTextState?.trim() === ''}>
                  Submit
                </Button>
              </View>
            )}
          </View>
        )}
      </FlashCardBodyContainer>
      {moreToLoad && (
        <FlashCardLoadMoreBtn handleExpandWordArray={handleExpandWordArray} />
      )}
    </>
  );
};

export default FlashCard;
