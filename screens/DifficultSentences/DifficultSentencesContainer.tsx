import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import DifficultSentencesSnippet from './DifficultSentencesSnippet';

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
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');

  const [sliceArrState, setSliceArrState] = useState(10);
  const [isShowDueOnly, setIsShowDueOnly] = useState(true);
  const [isMountedState, setIsMountedState] = useState(false);
  const [loadingCombineSentences, setLoadingCombineSentences] = useState(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const [includeWordsState, setIncludeWordsState] = useState(true);
  const [includeContentState, setIncludeContentState] = useState(false);
  const [includeSnippetsState, setIncludeSnippetsState] = useState(true);
  const scrollViewRef = useRef(null);

  const targetLanguageWordsState = useSelector(state => state.words);
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const numberOfWords = targetLanguageWordsState.length;

  const {
    sentenceReviewBulkAll,
    updateSentenceData,
    deleteWord,
    pureWords,
    fetchData,
    updateWordData,
    handleAdhocMinimalPair,
    combineWordsFromSingularDataProvider,
    handleAddCustomWordPrompt,
    updateContentMetaData,
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

  const {setLanguageSelectedState, languageSelectedState} =
    useLanguageSelector();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const defaultScreenState = () => {
    setSelectedDueCardState(null);
    setSelectedGeneralTopicState('');
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

  const toggleableSentencesMemoized = useMemo(() => {
    if (!isMountedState) {
      return [];
    }
    const today = new Date();
    const filteredSentences = [];
    const sourceLists = [difficultSentencesState];
    if (includeWordsState) sourceLists.push(dueWordsState);

    for (const list of sourceLists) {
      for (const sentence of list) {
        if (!includeContentState && sentence?.isContent) continue;
        if (!includeSnippetsState && sentence?.isSnippet) continue;

        const matchesTopic =
          !selectedGeneralTopicState ||
          sentence.generalTopic === selectedGeneralTopicState;

        const isEligible = !isShowDueOnly || isDueCheck(sentence, today);

        if (matchesTopic && isEligible) {
          filteredSentences.push(sentence);
        }
      }
    }

    return filteredSentences.sort(sortFilteredOrder) || [];
  }, [
    includeSnippetsState,
    includeContentState,
    includeWordsState,
    difficultSentencesState,
    dueWordsState,
    isMountedState,
    isShowDueOnly,
    selectedGeneralTopicState,
  ]);

  const generalTopicsAvailableMemoized = useMemo(() => {
    const today = new Date();
    const dueSentences = [];
    const dueTopicCount = {};

    for (const sentence of toggleableSentencesMemoized) {
      if (!isShowDueOnly || isDueCheck(sentence, today)) {
        dueSentences.push(sentence);
        if (sentence.generalTopic) {
          dueTopicCount[sentence.generalTopic] =
            (dueTopicCount[sentence.generalTopic] || 0) + 1;
        }
      }
    }

    return sortObjByKeys(dueTopicCount);
  }, [isShowDueOnly, toggleableSentencesMemoized]);

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

  const updateContentSnippetsDataScreenLevel = async ({
    snippetId,
    isRemove,
    fieldToUpdate,
    contentIndex,
  }) => {
    try {
      const thisContent = targetLanguageLoadedContentMasterState[contentIndex];
      const topicName = thisContent.title;
      const thisContentSnippets = thisContent?.snippets;

      if (isRemove) {
        const filteredSnippets = thisContentSnippets.filter(
          item => item.id !== snippetId,
        );
        await updateContentMetaData({
          topicName,
          fieldToUpdate: {
            snippets: [...filteredSnippets],
          },
          contentIndex,
        });

        const updatedState = difficultSentencesState.filter(
          sentenceData => sentenceData.id !== snippetId,
        );
        setDifficultSentencesState(updatedState);
      } else {
        const updatedSnippets = thisContentSnippets.map(item => {
          if (item.id === snippetId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        });

        await updateContentMetaData({
          topicName,
          fieldToUpdate: {
            snippets: [...updatedSnippets],
          },
          contentIndex,
        });

        const difficultUpdatedState = [...difficultSentencesState].map(item => {
          if (item.id === snippetId) {
            return {
              ...item,
              ...fieldToUpdate,
            };
          }
          return item;
        });
        setDifficultSentencesState(difficultUpdatedState);
      }
    } catch (error) {
      console.log('## updateContentSnippetsDataScreenLevel error', error);
    }
  };

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
    toggleableSentencesMemoized.forEach(item => {
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

  const combineWordsSentenceDiffSentence = async ({inputWords}) => {
    const res = await combineWordsFromSingularDataProvider({inputWords});
    const sentenceIds = res.map(item => item.id);

    const updatedDueCardsState = dueWordsState.map(item => {
      if (item.id === inputWords[0].id) {
        return {
          ...item,
          contexts: [...item.contexts, sentenceIds],
          contextData: [...item.contextData, ...res],
        };
      }
      return item;
    });
    setDifficultSentencesState(prev => [...prev, ...res]);
    setDueWordsState(updatedDueCardsState);
  };
  //

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

  // useEffect(() => {
  //   if (
  //     difficultSentencesState.length > 0 &&
  //     toggleableSentencesMemoized?.length === 0 &&
  //     selectedGeneralTopicState
  //   ) {
  //     // setSelectedGeneralTopicState('');
  //   }
  // }, [
  //   difficultSentencesState,
  //   toggleableSentencesMemoized,
  //   selectedGeneralTopicState,
  // ]);

  useEffect(() => {
    setIsMountedState(true);
  }, []);

  if (difficultSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  const realCapacity = toggleableSentencesMemoized.length;

  const dueLength = selectedGeneralTopicState
    ? generalTopicsAvailableMemoized[selectedGeneralTopicState]
    : generalTopicsAvailableMemoized
    ? Object.values(generalTopicsAvailableMemoized).reduce(
        (acc, val) => acc + val,
        0,
      )
    : 0;

  const displayedStudyItems = useMemo(
    () => toggleableSentencesMemoized.slice(0, 3),
    [toggleableSentencesMemoized],
  );

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
          handleShowCardInfo={handleSelectWord}
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
          {generalTopicsAvailableMemoized ? (
            <DifficultSentencesTopics
              generalTopicsAvailableState={generalTopicsAvailableMemoized}
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
            includeContentState={includeContentState}
            setIncludeContentState={setIncludeContentState}
            includeSnippetsState={includeSnippetsState}
            setIncludeSnippetsState={setIncludeSnippetsState}
          />
          <View style={{marginTop: 10}}>
            {displayedStudyItems?.map((sentence, index) => {
              const isWordCard = sentence?.isWord;
              if (isWordCard) {
                return (
                  <View style={{paddingVertical: 10}} key={sentence.id}>
                    <FlashCardProvider>
                      <FlashCard
                        combineWordsSentenceDiffSentence={
                          combineWordsSentenceDiffSentence
                        }
                        wordData={sentence}
                        index={index}
                        realCapacity={toggleableSentencesMemoized.length}
                        sliceArrState={null}
                        handleDeleteWord={handleDeleteWordFlashCard}
                        handleExpandWordArray={() => {}}
                        handleAdhocMinimalPairFunc={handleAdhocMinimalPairFunc}
                        scrollViewRef={scrollViewRef}
                        updateWordDataAdditionalFunc={
                          updateWordDataAdditionalFunc
                        }
                        handleAddCustomWordPromptFunc={
                          handleAddCustomWordPromptFunc
                        }
                        selectedDueCardState={selectedDueCardState}
                        setSelectedDueCardState={setSelectedDueCardState}
                      />
                    </FlashCardProvider>
                  </View>
                );
              }

              if (sentence?.isSnippet) {
                return (
                  <DifficultSentencesSnippet
                    key={sentence.id}
                    indexNum={index}
                    snippetData={sentence}
                    languageSelectedState={languageSelectedState}
                    updateContentSnippetsDataScreenLevel={
                      updateContentSnippetsDataScreenLevel
                    }
                  />
                );
              }
              const nextAudioIsTheSameUrl =
                sentence.isMediaContent &&
                sentence.topic ===
                  toggleableSentencesMemoized[index + 1]?.topic;
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
