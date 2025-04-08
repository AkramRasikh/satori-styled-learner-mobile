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
import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import CombineSentencesContainer from '../../components/CombineSentencesContainer';
import {FAB} from 'react-native-paper';
import AddSentenceContainer from '../../components/AddSentenceContainer';

function WordStudyContainer(): React.JSX.Element {
  const [tagsState, setTagsState] = useState<string[]>([]);
  const [generalTopicState, setGeneralTopicState] = useState<string[]>([]);
  const [showDueCardsState, setShowDueCardsState] = useState<boolean>(true);
  const [showAddSentenceState, setShowAddSentenceState] =
    useState<boolean>(false);
  const [sliceArrState, setSliceArrState] = useState(20);
  const [showCategories, setShowCategories] = useState(false);
  const [isMountedState, setIsMountedState] = useState(false);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);

  const targetLanguageLoadedSentences = useSelector(state => state.sentences);
  const targetLanguageWordsState = useSelector(state => state.words);
  const targetLanguageLoadedContent = useSelector(
    state => state.learningContent,
  );

  const scrollViewRef = useRef(null);

  const wordCategories = makeArrayUnique([...tagsState, ...generalTopicState]);

  const {languageSelectedState} = useLanguageSelector();

  const {combineWords, handleAdhocMinimalPair} = useData();

  const {
    deleteWord,
    wordStudyState,
    setWordStudyState,
    dueCardsState,
    setDueCardsState,
    selectedTopic,
    setSelectedTopic,
    combineWordsListState,
    setCombineWordsListState,
  } = useWordData();

  const {setDifficultSentencesState} = useDifficultSentences();

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

  const handleExportListToAI = async () => {
    try {
      setLoadingCombineSentences(true);
      const combinedSentencesRes = await combineWords({
        inputWords: combineWordsListState,
      });
      setDifficultSentencesState(prev => [...prev, ...combinedSentencesRes]);
      setCombineWordsListState([]);
    } catch (error) {
      console.log('## Error combining!', error);
    } finally {
      setLoadingCombineSentences(false);
    }
  };

  const handleAdhocMinimalPairFunc = async ({inputWord, mode}) => {
    const res = await handleAdhocMinimalPair({inputWord, mode});
    const sentenceIds = res.map(item => item.id);
    const updatedDueCardsState = dueCardsState.map(item => {
      if (item.id === inputWord.id) {
        console.log('## updated in here???');
        return {
          ...item,
          contexts: [...item.contexts, sentenceIds],
          contextData: [...item.contextData, ...res],
        };
      }
      return item;
    });
    setShowDueCardsState(updatedDueCardsState);
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
    <ScreenContainerComponent bottom={50}>
      {showAddSentenceState ? (
        <AddSentenceContainer
          setShowAddSentenceState={setShowAddSentenceState}
        />
      ) : (
        <View style={{padding: 10}}>
          <FAB
            label="Add sentence"
            size="small"
            onPress={() => setShowAddSentenceState(!showAddSentenceState)}
          />
        </View>
      )}
      {combineWordsListState?.length ? (
        <CombineSentencesContainer
          combineWordsListState={combineWordsListState}
          setCombineWordsListState={setCombineWordsListState}
          handleExportListToAI={handleExportListToAI}
          isLoading={loadingCombineSentences}
        />
      ) : null}
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{padding: 10}}>
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
            handleAdhocMinimalPairFunc={handleAdhocMinimalPairFunc}
          />
        </View>
      </ScrollView>
    </ScreenContainerComponent>
  );
}

export default WordStudyContainer;
