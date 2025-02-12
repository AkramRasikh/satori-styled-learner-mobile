import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import SelectedCategoriesWordsSection from '../../components/SelectedCategoriesSection';
import FlashcardsWordsSection from '../../components/FlashcardsWordsSection';
import useWordData from '../../context/WordData/useWordData';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import WordStudyHeader from './WordStudyHeader';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';

function WordStudyContainer(): React.JSX.Element {
  const [tagsState, setTagsState] = useState<string[]>([]);
  const [generalTopicState, setGeneralTopicState] = useState<string[]>([]);
  const [showDueCardsState, setShowDueCardsState] = useState<boolean>(true);
  const [sliceArrState, setSliceArrState] = useState(20);
  const [showCategories, setShowCategories] = useState(false);
  const [isMountedState, setIsMountedState] = useState(false);

  const targetLanguageLoadedSentences = useSelector(state => state.sentences);
  const targetLanguageWordsState = useSelector(state => state.words);
  const targetLanguageLoadedContent = useSelector(
    state => state.learningContent,
  );

  const scrollViewRef = useRef(null);

  const wordCategories = makeArrayUnique([...tagsState, ...generalTopicState]);

  const {languageSelectedState} = useLanguageSelector();

  const {
    deleteWord,
    wordStudyState,
    setWordStudyState,
    dueCardsState,
    setDueCardsState,
    selectedTopic,
    setSelectedTopic,
    updatePromptState,
  } = useWordData();

  useFormatWordsToStudy({
    targetLanguageWordsState,
    setWordStudyState,
    setTagsState,
    setGeneralTopicState,
    targetLanguageLoadedContent,
    targetLanguageLoadedSentences,
    setDueCardsState,
    languageSelectedState,
  });

  const handleExpandWordArray = () => {
    setSliceArrState(prev => prev + 5);
  };

  const handleShowThisCategoriesWords = category => {
    setSelectedTopic(category);
  };

  const handleDeleteWordFlashCard = async wordFromFlashCard => {
    if (!wordFromFlashCard) {
      return;
    }
    const selectedWordId = wordFromFlashCard.id;
    const wordBaseForm = wordFromFlashCard.baseForm;
    try {
      const updatedWordState = wordStudyState.filter(
        item => item.id !== selectedWordId,
      );
      setWordStudyState(updatedWordState);
      await deleteWord({
        wordId: selectedWordId,
        wordBaseForm,
      });
    } catch (error) {
      console.log('## Error handleDeleteWordFlashCard', {error});
    }
  };

  const isDueCheck = (wordData, todayDateObj) => {
    return (
      (wordData?.nextReview && wordData.nextReview < todayDateObj) ||
      new Date(wordData?.reviewData?.due) < todayDateObj
    );
  };

  useEffect(() => {
    setIsMountedState(true);
  }, []);

  useEffect(() => {
    const todayDateObj = new Date();

    if (isMountedState) {
      const thisCategoriesWords = [...wordStudyState].filter(wordData => {
        const showAll = !showDueCardsState && !selectedTopic;
        if (showAll) {
          return true;
        }
        const timeCheckEligibility =
          !showDueCardsState || isDueCheck(wordData, todayDateObj);
        if (timeCheckEligibility) {
          return wordData.thisWordsCategories.some(
            oneCategory => oneCategory === selectedTopic || !selectedTopic,
          );
        }
        return false;
      });
      setDueCardsState(thisCategoriesWords);
    }
  }, [
    selectedTopic,
    wordStudyState,
    isMountedState,
    setDueCardsState,
    showDueCardsState,
  ]);

  const realCapacity = dueCardsState.length;

  const slicedArr = dueCardsState.slice(0, sliceArrState);

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <WordStudyHeader
          setShowDueCardsState={setShowDueCardsState}
          setShowCategories={setShowCategories}
          showDueCardsState={showDueCardsState}
          selectedTopic={selectedTopic}
          showCategories={showCategories}
          setSelectedTopic={setSelectedTopic}
          setDueCardsState={setDueCardsState}
          wordStudyState={wordStudyState}
          wordCategories={wordCategories}
          realCapacity={realCapacity}
        />
        {showCategories && !selectedTopic && (
          <SelectedCategoriesWordsSection
            wordCategories={wordCategories}
            handleShowThisCategoriesWords={handleShowThisCategoriesWords}
          />
        )}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5,
          }}>
          <FlashcardsWordsSection
            dueCardsState={slicedArr}
            handleDeleteWord={handleDeleteWordFlashCard}
            handleExpandWordArray={handleExpandWordArray}
            sliceArrState={sliceArrState}
            realCapacity={realCapacity}
            scrollViewRef={scrollViewRef}
          />
        </View>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default WordStudyContainer;
