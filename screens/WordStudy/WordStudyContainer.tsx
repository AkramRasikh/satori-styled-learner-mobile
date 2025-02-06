import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, Text, View} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import SelectedCategoriesWordsSection from '../../components/SelectedCategoriesSection';
import {FlashCardsSectionContainer} from '../../components/FlashcardsWordsSection';
import useWordData from '../../context/WordData/useWordData';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import PillButton from '../../components/PillButton';
import {Button, Icon, MD3Colors} from 'react-native-paper';

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
          <View
            style={{
              margin: 5,
            }}>
            {!selectedTopic ? (
              <Button
                onPress={() => setShowCategories(!showCategories)}
                mode="outlined"
                icon={
                  showCategories
                    ? () => (
                        <Icon
                          source="filter-variant-remove"
                          color={MD3Colors.error50}
                        />
                      )
                    : ''
                }>
                <Text>Categories ({numOfCategories})</Text>
              </Button>
            ) : (
              <Button
                onPress={handleRemoveSelectedTopic}
                mode="outlined"
                icon={() => (
                  <Icon
                    source="filter-variant-remove"
                    color={MD3Colors.error50}
                  />
                )}
                buttonColor="yellow">
                <Text> {selectedTopic}</Text>
              </Button>
            )}
          </View>
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
          handleExpandWordArray={handleExpandWordArray}
          realCapacity={realCapacity}
          sliceArrState={sliceArrState}
        />
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default WordStudyContainer;
