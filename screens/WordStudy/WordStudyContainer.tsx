import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import ToastMessage from '../../components/ToastMessage';
import SelectedTopicWordsSection from '../../components/SelectedTopicWordsSection';
import SelectedCategoriesWordsSection from '../../components/SelectedCategoriesSection';
import {FlashCardsSectionContainer} from '../../components/FlashcardsWordsSection';
import useWordData from '../../context/Data/useWordData';
import WordStudyCardsCTA from '../../components/WordStudyCardsCTA';

function WordStudyContainer({
  targetLanguageLoadedSentences,
  targetLanguageLoadedContent,
}): React.JSX.Element {
  const [tagsState, setTagsState] = useState<string[]>([]);
  const [generalTopicState, setGeneralTopicState] = useState<string[]>([]);
  const [showDueCardsState, setShowDueCardsState] = useState<boolean>(false);

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
    targetLanguageWordsState,
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

  useEffect(() => {
    if (showDueCardsState && dueCardsState?.length === 0) {
      setShowDueCardsState(false);
    }
  }, [wordStudyState, dueCardsState]);

  const handleShowDueCards = () => {
    if (dueCardsState?.length === 0) {
      return;
    }
    if (showDueCardsState) {
      setShowDueCardsState(false);
    } else {
      setShowDueCardsState(true);
    }
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
    const thisCategoriesWords = wordStudyState.filter(wordData =>
      wordData.thisWordsCategories.some(
        oneCategory => oneCategory === category,
      ),
    );
    setSelectedTopicWords(thisCategoriesWords);
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

  const hasSelectedTopicWords = selectedTopic && selectedTopicWords?.length > 0;

  const showFlashCardSection =
    tempNewStudyCardsState?.length > 0 ||
    (showDueCardsState && !hasSelectedTopicWords);

  const showWordCategories =
    !hasSelectedTopicWords &&
    !showDueCardsState &&
    tempNewStudyCardsState?.length === 0;

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#D3D3D3',
        minHeight: '100%',
      }}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {!hasSelectedTopicWords && (
          <WordStudyCardsCTA
            dueCardsState={dueCardsState}
            handleShowDueCards={handleShowDueCards}
            handleShowNewRandomCards={handleShowNewRandomCards}
          />
        )}

        {showFlashCardSection && (
          <FlashCardsSectionContainer
            handleDeleteWordFlashCard={handleDeleteWordFlashCard}
            dueCardsState={dueCardsState}
            tempNewStudyCardsState={tempNewStudyCardsState}
          />
        )}
        {showWordCategories && (
          <SelectedCategoriesWordsSection
            wordCategories={wordCategories}
            handleShowThisCategoriesWords={handleShowThisCategoriesWords}
          />
        )}
        {hasSelectedTopicWords ? (
          <View>
            <SelectedTopicWordsSection
              selectedTopicWords={selectedTopicWords}
              selectedWordState={selectedWordState}
              setSelectedWordState={setSelectedWordState}
              handleDeleteWord={handleDeleteWord}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export default WordStudyContainer;
