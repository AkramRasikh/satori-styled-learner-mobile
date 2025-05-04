import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import WordModalDifficultSentence from '../../components/WordModalDifficultSentence';
import DifficultSentencesTopics from './DifficultSentencesTopics';
import DifficultSentencesWordNavigator from './DifficultSentencesWordNavigator';
import DifficultSentencesSegmentHeader from './DifficultSentencesSegmentHeader';
import DifficultSentenceComponent from '../../components/DifficultSentence';
import useOpenGoogleTranslate from '../../hooks/useOpenGoogleTranslate';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import LanguageSelection from '../home/components/LanguageSelection';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import CombineSentencesContainer from '../../components/CombineSentencesContainer';
import {sortObjByKeys} from '../../utils/sort-obj-by-keys';
import FlashCard from '../../components/FlashCard';
import {FlashCardProvider} from '../../components/FlashCard/context/FlashCardProvider';

const sortFilteredOrder = (a, b) => {
  if (!a.topic) return 1; // Push objects without a topic to the end
  if (!b.topic) return -1; // Keep objects with topics at the front
  const topicComparison = a.topic.localeCompare(b.topic, undefined, {
    numeric: true,
  });
  if (topicComparison !== 0) {
    return topicComparison;
  }

  // At this point, topics are equal — check sentenceIndex
  if (a.sentenceIndex != null && b.sentenceIndex != null) {
    return a.sentenceIndex - b.sentenceIndex;
  }

  // If only one has sentenceIndex, it comes first
  if (a.sentenceIndex != null) return -1;
  if (b.sentenceIndex != null) return 1;

  // Neither has sentenceIndex — maintain current order
  return 0;
};

const DifficultSentencesContainer = ({navigation}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);
  const [
    selectedDueCardComprehensiveState,
    setSelectedDueCardComprehensiveState,
  ] = useState(null);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');
  const [generalTopicsAvailableState, setGeneralTopicsAvailableState] =
    useState(null);
  const [sliceArrState, setSliceArrState] = useState(10);
  const [isShowDueOnly, setIsShowDueOnly] = useState(true);
  const [isMountedState, setIsMountedState] = useState(false);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const [includeWordsState, setIncludeWordsState] = useState(true);
  const scrollViewRef = useRef(null);

  const targetLanguageWordsState = useSelector(state => state.words);
  const numberOfWords = targetLanguageWordsState.length;

  const {
    sentenceReviewBulkAll,
    updateSentenceData,
    deleteWord,
    pureWords,
    fetchData,
    updateWordData,
    handleAdhocMinimalPair,
    handleAddCustomWordPrompt,
  } = useData();

  const {
    handleCombineSentences,
    combineWordsListState,
    setCombineWordsListState,
    refreshDifficultSentencesInfo,
    combineSentenceContext,
    setCombineSentenceContext,
    dueWordsState,
    setDueWordsState,
  } = useDifficultSentences();

  const route = useRoute();

  const {refreshState} = route.params;

  useEffect(() => {
    if (refreshState) {
      // account for state update when transitioning between pages
      refreshDifficultSentencesInfo();
    }
  }, [refreshState]);

  const {setLanguageSelectedState} = useLanguageSelector();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const defaultScreenState = () => {
    setToggleableSentencesState([]);
    setSelectedDueCardState(null);
    setSelectedGeneralTopicState('');
    setGeneralTopicsAvailableState(null);
    setSliceArrState(10);
    setIsShowDueOnly(true);
    setIsMountedState(true);
  };

  const {
    difficultSentencesState,
    removeDifficultSentenceFromState,
    setDifficultSentencesState,
    updateDifficultSentence,
  } = useDifficultSentences();

  const handleNavigationToWords = () => {
    navigation.navigate('WordStudy');
  };

  const isDueCheck = (sentence, todayDateObj) => {
    return (
      (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
      new Date(sentence?.reviewData?.due) < todayDateObj
    );
  };

  const showDueInit = () => {
    const today = new Date();
    const dueSentences = [];
    const dueTopicCount = {};

    for (const sentence of difficultSentencesState) {
      if (isDueCheck(sentence, today)) {
        dueSentences.push(sentence);
        if (sentence.generalTopic) {
          dueTopicCount[sentence.generalTopic] =
            (dueTopicCount[sentence.generalTopic] || 0) + 1;
        }
      }
    }

    if (dueSentences.length > 0) {
      setToggleableSentencesState(
        dueSentences.sort(sortFilteredOrder).slice(0, 3),
      );
      if (Object.keys(dueTopicCount).length > 0) {
        setGeneralTopicsAvailableState(sortObjByKeys(dueTopicCount));
      }
    } else {
      const fallbackTopicCount = {};
      for (const sentence of difficultSentencesState) {
        if (sentence.generalTopic) {
          fallbackTopicCount[sentence.generalTopic] =
            (fallbackTopicCount[sentence.generalTopic] || 0) + 1;
        }
      }

      setToggleableSentencesState(
        difficultSentencesState.sort(sortFilteredOrder).slice(0, 3),
      );
      if (Object.keys(fallbackTopicCount).length > 0) {
        setGeneralTopicsAvailableState(sortObjByKeys(fallbackTopicCount));
      }
    }
  };

  const handleShowThisTopicsSentences = topic => {
    if (topic === selectedGeneralTopicState) {
      setSelectedGeneralTopicState('');
    } else {
      setSelectedGeneralTopicState(topic);
    }
  };

  const handleWordUpdate = wordData => {
    updateWordData(wordData);
    setSelectedDueCardState(null);
  };

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const updateSentenceDataScreenLevel = async ({
    isAdhoc,
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    const isRemoveFromDifficultSentences = fieldToUpdate?.nextReview === null;

    if (isRemoveFromDifficultSentences) {
      removeDifficultSentenceFromState(sentenceId);
    } else {
      updateDifficultSentence({sentenceId, updateDataRes: fieldToUpdate});
    }

    await updateSentenceData({
      isAdhoc,
      topicName,
      sentenceId,
      fieldToUpdate,
      contentIndex,
      isRemoveReview: isRemoveFromDifficultSentences,
    });
  };

  const handleExportListToAI = async () => {
    try {
      setLoadingCombineSentences(true);
      await handleCombineSentences();
    } catch (error) {
    } finally {
      setLoadingCombineSentences(false);
    }
  };

  const handleSelectWord = selectingWord => {
    const mostUpToDateWord = targetLanguageWordsState.find(
      i => i.id === selectingWord.id,
    );
    if (mostUpToDateWord) {
      setSelectedDueCardState(mostUpToDateWord);
    }
  };

  const handleDeleteWord = async () => {
    await deleteWord({
      wordId: selectedDueCardState.id,
      wordBaseForm: selectedDueCardState.baseForm,
    });
    setSelectedDueCardState(null);
  };

  const handleLongPressTopics = async longPressedTopic => {
    const topicsArr = [];
    const contentIndexArr = [];
    difficultSentencesState.forEach(i => {
      const thisTopic = i?.topic;
      const thisGeneralTopic = i?.generalTopic;
      if (
        thisGeneralTopic === longPressedTopic &&
        !topicsArr.includes(thisTopic)
      ) {
        topicsArr.push(thisTopic);
        contentIndexArr.push(i?.contentIndex);
      }
    });

    try {
      setIsLanguageLoading(true);
      const bulkResponse = await sentenceReviewBulkAll({
        topics: topicsArr,
        generalTopic: longPressedTopic,
        contentIndexArr,
      });
      if (bulkResponse) {
        const updatedDifficultSentences = difficultSentencesState.filter(
          item => item.generalTopic !== longPressedTopic,
        );
        setDifficultSentencesState(updatedDifficultSentences);
      }
    } catch (error) {
      console.log('## Error handleLongPressTopics', error);
    } finally {
      setIsLanguageLoading(false);
    }
  };

  const getThisTopicsDueSentences = topic => {
    const ids = [];
    toggleableSentencesState.forEach(item => {
      if (item.topic === topic) {
        ids.push(item.id);
      }
    });

    return ids;
  };

  const handleDeleteWordFlashCard = async wordFromFlashCard => {
    if (!wordFromFlashCard) {
      return;
    }
    const selectedWordId = wordFromFlashCard.id;
    const wordBaseForm = wordFromFlashCard.baseForm;
    try {
      const updatedWordState = dueWordsState.filter(
        item => item.id !== selectedWordId,
      );
      setDueWordsState(updatedWordState);
      await deleteWord({
        wordId: selectedWordId,
        wordBaseForm,
      });
    } catch (error) {
      console.log('## Error handleDeleteWordFlashCard', {error});
    }
  };

  useEffect(() => {
    if (!isMountedState) return;

    const today = new Date();
    const topicCount = {};
    const filteredSentences = [];

    const wordsState = includeWordsState ? dueWordsState : [];
    for (const sentence of [...difficultSentencesState, ...wordsState]) {
      const matchesTopic =
        !selectedGeneralTopicState ||
        sentence.generalTopic === selectedGeneralTopicState;

      const isEligible = !isShowDueOnly || isDueCheck(sentence, today);

      if (matchesTopic && isEligible) {
        filteredSentences.push(sentence);
      }
      if (isEligible) {
        topicCount[sentence.generalTopic] =
          (topicCount[sentence.generalTopic] || 0) + 1;
      }
    }

    setToggleableSentencesState(
      filteredSentences.sort(sortFilteredOrder).slice(0, 3),
    );

    setGeneralTopicsAvailableState(sortObjByKeys(topicCount));
  }, [
    difficultSentencesState,
    selectedGeneralTopicState,
    isShowDueOnly,
    isMountedState,
    dueWordsState,
    includeWordsState,
  ]);

  const updateWordDataAdditionalFunc = updatedWordData => {
    const updatedWordState = dueWordsState.map(item => {
      if (item.id === updatedWordData.wordId) {
        const postFieldUpdatedWord = {
          ...item,
          reviewData: updatedWordData.fieldToUpdate.reviewData,
        };
        return postFieldUpdatedWord;
      }
      return item;
    });

    setDueWordsState(updatedWordState);
  };

  const handleAdhocMinimalPairFunc = async ({inputWord, mode}) => {
    const res = await handleAdhocMinimalPair({inputWord, mode});
    const sentenceIds = res.map(item => item.id);

    const updatedDueCardsState = dueWordsState.map(item => {
      if (item.id === inputWord.id) {
        return {
          ...item,
          contexts: [...item.contexts, sentenceIds],
          contextData: [...item.contextData, ...res],
        };
      }
      return item;
    });
    setDueWordsState(updatedDueCardsState);
  };

  const handleAddCustomWordPromptFunc = async ({inputWord, prompt}) => {
    const res = await handleAddCustomWordPrompt({inputWord, prompt});
    const sentenceIds = res.map(item => item.id);

    const updatedDueCardsState = dueWordsState.map(item => {
      if (item.id === inputWord.id) {
        return {
          ...item,
          contexts: [...item.contexts, sentenceIds],
          contextData: [...item.contextData, ...res],
        };
      }
      return item;
    });
    setDueWordsState(updatedDueCardsState);
  };

  const handleLanguageSelection = async selectedLanguage => {
    try {
      setIsLanguageLoading(true);
      defaultScreenState();
      await fetchData(selectedLanguage);
      setLanguageSelectedState(selectedLanguage);
    } catch (error) {
    } finally {
      setIsLanguageLoading(false);
    }
  };

  useEffect(() => {
    if (
      difficultSentencesState.length > 0 &&
      toggleableSentencesState?.length === 0 &&
      selectedGeneralTopicState
    ) {
      setSelectedGeneralTopicState('');
    }
  }, [
    difficultSentencesState,
    toggleableSentencesState,
    selectedGeneralTopicState,
  ]);

  useEffect(() => {
    setIsMountedState(true);
    showDueInit();
  }, []);

  if (difficultSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  const realCapacity = toggleableSentencesState.length;

  const dueLength = selectedGeneralTopicState
    ? generalTopicsAvailableState[selectedGeneralTopicState]
    : generalTopicsAvailableState
    ? Object.values(generalTopicsAvailableState).reduce(
        (acc, val) => acc + val,
        0,
      )
    : 0;

  return (
    <ScreenContainerComponent>
      {combineWordsListState?.length ? (
        <CombineSentencesContainer
          combineWordsListState={combineWordsListState}
          setCombineWordsListState={setCombineWordsListState}
          handleExportListToAI={handleExportListToAI}
          isLoading={loadingCombineSentences}
          combineSentenceContext={combineSentenceContext}
          setCombineSentenceContext={setCombineSentenceContext}
        />
      ) : null}
      {isLanguageLoading && (
        <ActivityIndicator
          animating={true}
          color={MD2Colors.amber300}
          size="large"
          style={{
            position: 'absolute',
            top: '40%',
            alignSelf: 'center',
          }}
        />
      )}
      <LanguageSelection handleLanguageSelection={handleLanguageSelection} />
      <View
        style={{
          padding: 10,
          paddingBottom: 70,
          opacity: isLanguageLoading ? 0.5 : 1,
          marginBottom: 70,
        }}>
        {selectedDueCardState && (
          <WordModalDifficultSentence
            visible={selectedDueCardState}
            updateWordData={handleWordUpdate}
            onClose={() => setSelectedDueCardState(null)}
            deleteWord={() => handleDeleteWord(selectedDueCardState)}
          />
        )}
        <DifficultSentencesSegmentHeader
          dueLength={dueLength}
          allLength={difficultSentencesState.length}
          isShowDueOnly={isShowDueOnly}
          setIsShowDueOnly={setIsShowDueOnly}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}
          ref={scrollViewRef}>
          {generalTopicsAvailableState ? (
            <DifficultSentencesTopics
              generalTopicsAvailableState={generalTopicsAvailableState}
              handleShowThisTopicsSentences={handleShowThisTopicsSentences}
              selectedGeneralTopicState={selectedGeneralTopicState}
              handleLongPressTopics={handleLongPressTopics}
            />
          ) : null}
          <DifficultSentencesWordNavigator
            handleNavigationToWords={handleNavigationToWords}
            numberOfWords={numberOfWords}
            includeWordsState={includeWordsState}
            setIncludeWordsState={setIncludeWordsState}
          />
          <View style={{marginTop: 10}}>
            {toggleableSentencesState.map((sentence, index) => {
              const isWordCard = sentence?.isWord;
              if (isWordCard) {
                return (
                  <View style={{paddingVertical: 10}} key={sentence.id}>
                    <FlashCardProvider>
                      <FlashCard
                        wordData={sentence}
                        index={index}
                        realCapacity={toggleableSentencesState.length}
                        sliceArrState={null}
                        handleDeleteWord={handleDeleteWordFlashCard}
                        handleExpandWordArray={() => {}}
                        selectedDueCardState={selectedDueCardComprehensiveState}
                        setSelectedDueCardState={
                          setSelectedDueCardComprehensiveState
                        }
                        handleAdhocMinimalPairFunc={handleAdhocMinimalPairFunc}
                        scrollViewRef={scrollViewRef}
                        updateWordDataAdditionalFunc={
                          updateWordDataAdditionalFunc
                        }
                        handleAddCustomWordPromptFunc={
                          handleAddCustomWordPromptFunc
                        }
                      />
                    </FlashCardProvider>
                  </View>
                );
              }
              const nextAudioIsTheSameUrl =
                sentence.isMediaContent &&
                sentence.topic === toggleableSentencesState[index + 1]?.topic;
              return (
                <DifficultSentenceComponent
                  key={sentence.id}
                  toggleableSentencesStateLength={realCapacity}
                  updateSentenceData={updateSentenceDataScreenLevel}
                  navigation={navigation}
                  sliceArrState={sliceArrState}
                  setSliceArrState={setSliceArrState}
                  realCapacity={realCapacity}
                  handleSelectWord={handleSelectWord}
                  handleWordUpdate={handleWordUpdate}
                  sentence={sentence}
                  openGoogleTranslateApp={openGoogleTranslateApp}
                  indexNum={index}
                  underlineWordsInSentence={underlineWordsInSentence}
                  combineWordsListState={combineWordsListState}
                  setCombineWordsListState={setCombineWordsListState}
                  nextAudioIsTheSameUrl={nextAudioIsTheSameUrl}
                  getThisTopicsDueSentences={getThisTopicsDueSentences}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
