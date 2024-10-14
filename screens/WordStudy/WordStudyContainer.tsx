import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import ToastMessage from '../../components/ToastMessage';
import SelectedTopicWordsSection from '../../components/SelectedTopicWordsSection';
import SelectedCategoriesWordsSection from '../../components/SelectedCategoriesSection';
import FlashcardsWordsSection from '../../components/FlashcardsWordsSection';
import useWordData from '../../context/Data/useWordData';

function WordStudyContainer({
  japaneseWordsState,
  japaneseAdhocLoadedSentences,
  japaneseLoadedContent,
  updatePromptState,
}): React.JSX.Element {
  const [tagsState, setTagsState] = useState([]);
  const [generalTopicState, setGeneralTopicState] = useState([]);
  const [showDueCardsState, setShowDueCardsState] = useState(false);

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
  } = useWordData();

  const hasSelectedTopicWords = selectedTopic && selectedTopicWords?.length > 0;

  useFormatWordsToStudy({
    japaneseWordsState,
    setWordStudyState,
    setTagsState,
    setGeneralTopicState,
    japaneseLoadedContent,
    japaneseAdhocLoadedSentences,
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
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#CCCCCC',
                borderColor: 'black',
                borderRadius: 10,
                padding: 10,
              }}
              onPress={handleShowDueCards}>
              <Text>Due Cards: {dueCardsState.length}</Text>
            </TouchableOpacity>
          </View>
        )}
        {showDueCardsState && !hasSelectedTopicWords && (
          <FlashcardsWordsSection
            dueCardsState={dueCardsState}
            handleDeleteWord={handleDeleteWordFlashCard}
          />
        )}

        {!hasSelectedTopicWords && !showDueCardsState && (
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
