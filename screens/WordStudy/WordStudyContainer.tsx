import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import SelectedCategoriesWordsSection from '../../components/SelectedCategoriesSection';
import {FlashCardsSectionContainer} from '../../components/FlashcardsWordsSection';
import useWordData from '../../context/WordData/useWordData';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import PillButton from '../../components/PillButton';

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

  const wordCategories = makeArrayUnique([...tagsState, ...generalTopicState]);

  const {
    deleteWord,
    wordStudyState,
    setWordStudyState,
    dueCardsState,
    setDueCardsState,
    selectedTopicWords,
    setSelectedTopicWords,
    selectedTopic,
    setSelectedTopic,
    selectedWordState,
    setSelectedWordState,
    updatePromptState,
    tempNewStudyCardsState,
    setTempNewStudyCardsState,
  } = useWordData();

  useFormatWordsToStudy({
    targetLanguageWordsState,
    setWordStudyState,
    setTagsState,
    setGeneralTopicState,
    targetLanguageLoadedContent,
    targetLanguageLoadedSentences,
    setDueCardsState,
  });

  const handleExpandWordArray = () => {
    setSliceArrState(prev => prev + 5);
  };

  const getRandomInt = max => {
    return Math.floor(Math.random() * max);
  };

  const handleShowNewRandomCards = () => {
    // general word check
    const randomNewWordPool = wordStudyState.filter(item => !item?.reviewData);
    const numberOfNewCards = randomNewWordPool.length;
    const newCardArr = [];
    const newCardLimit =
      randomNewWordPool.length >= 4 ? 4 : randomNewWordPool.length;

    for (let i = 0; newCardLimit > newCardArr.length; i++) {
      const randomGeneratedNumber = getRandomInt(numberOfNewCards);
      if (!newCardArr.includes(randomGeneratedNumber)) {
        newCardArr.push(randomGeneratedNumber);
      }
    }

    const newStudyArr = newCardArr.map(arrIndex => randomNewWordPool[arrIndex]);
    setTempNewStudyCardsState(newStudyArr);
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
      await deleteWord({
        wordId: selectedWordId,
        wordBaseForm,
      });
      const updatedSelectedTopicWords = dueCardsState.filter(
        item => item.id !== selectedWordId,
      );
      setDueCardsState(updatedSelectedTopicWords);
    } catch (error) {
      console.log('## Error handleDeleteWordFlashCard', {error});
    }
  };

  const handleDeleteWord = async () => {
    if (!selectedWordState) {
      return;
    }
    const selectedWordId = selectedWordState.id;
    const wordBaseForm = selectedWordState.baseForm;
    try {
      await deleteWord({
        wordId: selectedWordId,
        wordBaseForm,
      });
      const updatedSelectedTopicWords = selectedTopicWords.filter(
        item => item.id !== selectedWordId,
      );
      setSelectedWordState(null);
      setSelectedTopicWords(updatedSelectedTopicWords);
    } catch (error) {
      console.log('## Error handleDeleteWord', {error});
    }
  };

  const isDueCheck = (wordData, todayDateObj) => {
    return (
      (wordData?.nextReview && wordData.nextReview < todayDateObj) ||
      new Date(wordData?.reviewData?.due) < todayDateObj
    );
  };

  const handleRemoveSelectedTopic = () => {
    setSelectedTopic('');
    setDueCardsState(wordStudyState);
  };

  useEffect(() => {
    setIsMountedState(true);
  }, []);

  useEffect(() => {
    const todayDateObj = new Date();

    if (isMountedState) {
      const thisCategoriesWords = [...wordStudyState].filter(wordData => {
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
  }, [selectedTopic, wordStudyState, isMountedState, showDueCardsState]);

  const realCapacity = dueCardsState.length;
  const fullCapacity = targetLanguageWordsState.length;

  const numOfCategories = wordCategories.length;

  const slicedDueState = dueCardsState.slice(0, sliceArrState); // is there an issue with this?

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 10,
          }}>
          <PillButton
            isShowDueOnly={showDueCardsState}
            setIsShowDueOnly={setShowDueCardsState}
          />
          {!selectedTopic ? (
            <TouchableOpacity
              style={{
                backgroundColor: 'grey',
                margin: 5,
                padding: 5,
                borderRadius: 5,
              }}
              onPress={() => setShowCategories(!showCategories)}>
              <Text>Categories ({numOfCategories})</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: 'yellow',
                alignSelf: 'center',
                padding: 5,
                marginBottom: 5,
                borderRadius: 5,
              }}
              onPress={handleRemoveSelectedTopic}>
              <Text>{selectedTopic} ❌</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 10,
          }}>
          <Text>
            {realCapacity}/{fullCapacity}
          </Text>
        </View>
        {showCategories && !selectedTopic && (
          <SelectedCategoriesWordsSection
            wordCategories={wordCategories}
            handleShowThisCategoriesWords={handleShowThisCategoriesWords}
          />
        )}
        <FlashCardsSectionContainer
          handleDeleteWordFlashCard={handleDeleteWordFlashCard}
          dueCardsState={slicedDueState}
          tempNewStudyCardsState={tempNewStudyCardsState}
          handleExpandWordArray={handleExpandWordArray}
          realCapacity={realCapacity}
          sliceArrState={sliceArrState}
        />
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default WordStudyContainer;
