import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import WordModalDifficultSentence from '../../components/WordModalDifficultSentence';
import DifficultSentencesTopics from './DifficultSentencesTopics';
import DifficultSentencesWordNavigator from './DifficultSentencesWordNavigator';
import DifficultSentencesSegmentHeader from './DifficultSentencesSegmentHeader';
import DifficultSentenceComponent from '../../components/DifficultSentence';
import {countArrayOccurrencesToObj} from '../../utils/count-array-occurrences-to-obj';

const DifficultSentencesContainer = ({navigation}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');
  const [selectedDueCardState, setSelectedDueCardState] = useState(null);
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');
  const [generalTopicsAvailableState, setGeneralTopicsAvailableState] =
    useState(null);
  const [sliceArrState, setSliceArrState] = useState(20);
  const [isShowDueOnly, setIsShowDueOnly] = useState(true);
  const [isMountedState, setIsMountedState] = useState(true);

  const targetLanguageWordsState = useSelector(state => state.words);
  const numberOfWords = targetLanguageWordsState.length;
  const {
    updateSentenceData,
    updatePromptState,
    addSnippet,
    removeSnippet,
    deleteWord,
    updateWordData,
    updatingSentenceState,
  } = useData();

  const {
    difficultSentencesState,
    removeDifficultSentenceFromState,
    updateDifficultSentence,
    refreshDifficultSentencesInfo,
  } = useDifficultSentences();

  const handleNavigationToWords = () => {
    navigation.navigate('WordStudy');
  };

  const handleRemoveSnippet = async ({snippetId, sentenceId}) => {
    const deletedSnippetId = await removeSnippet({
      snippetId,
      sentenceId,
    });
    return deletedSnippetId;
  };

  const handleAddSnippet = async snippetData => {
    const snippetDataFromAPI = await addSnippet(snippetData);
    if (snippetDataFromAPI) {
      return snippetDataFromAPI;
    }
  };

  const handleRefreshFunc = () => {
    refreshDifficultSentencesInfo();
    setSelectedGeneralTopicState('');
    showDueInit();
    setIsMountedState(true);
  };

  const isDueCheck = (sentence, todayDateObj) => {
    return (
      (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
      new Date(sentence?.reviewData?.due) < todayDateObj
    );
  };

  const showDueInit = () => {
    const todayDateObj = new Date();
    const toggleableSentenceTopics = [];
    const filteredForDueOnly = [...difficultSentencesState].filter(sentence => {
      const isCurrentlyDue = isDueCheck(sentence, todayDateObj);

      if (sentence.generalTopic && isCurrentlyDue) {
        toggleableSentenceTopics.push(sentence.generalTopic);
      }
      return isCurrentlyDue;
    });
    if (filteredForDueOnly?.length > 0) {
      if (toggleableSentenceTopics.length > 0) {
        setGeneralTopicsAvailableState(
          countArrayOccurrencesToObj(toggleableSentenceTopics),
        );
      }
      setToggleableSentencesState(filteredForDueOnly);
    } else {
      const generalTopicsCollectively = [];
      difficultSentencesState.forEach(sentence => {
        if (sentence.generalTopic) {
          generalTopicsCollectively.push(sentence.generalTopic);
        }
      });
      setToggleableSentencesState(difficultSentencesState);
      if (generalTopicsCollectively.length > 0) {
        setGeneralTopicsAvailableState(
          countArrayOccurrencesToObj(generalTopicsCollectively),
        );
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

  const updateSentenceDataScreenLevel = async ({
    isAdhoc,
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    const isRemoveFromDifficultSentences =
      !isAdhoc && fieldToUpdate?.nextReview === null;

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
    });
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

  useEffect(() => {
    if (isMountedState) {
      const todayDateObj = new Date();

      const toggleableSentenceTopics = [];

      const updatedToggleStateWithSelectedTopic = [
        ...difficultSentencesState,
      ].filter(i => {
        const thisTopic =
          !selectedGeneralTopicState ||
          i.generalTopic === selectedGeneralTopicState;
        const timeCheckEligibility =
          !isShowDueOnly || isDueCheck(i, todayDateObj);
        if (timeCheckEligibility) {
          toggleableSentenceTopics.push(i.generalTopic);
        }

        return (
          (!selectedGeneralTopicState || thisTopic) && timeCheckEligibility
        );
      });
      setToggleableSentencesState(updatedToggleStateWithSelectedTopic);
      setGeneralTopicsAvailableState(
        countArrayOccurrencesToObj(toggleableSentenceTopics),
      );
    }
  }, [
    difficultSentencesState,
    selectedGeneralTopicState,
    isShowDueOnly,
    isMountedState,
  ]);

  useEffect(() => {
    showDueInit(difficultSentencesState);
  }, []);

  if (difficultSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  const realCapacity = toggleableSentencesState.length;
  const slicedRenderedSentenceArr = toggleableSentencesState.slice(
    0,
    sliceArrState,
  );
  const toggleableSentencesStateLength = slicedRenderedSentenceArr.length;

  return (
    <ScreenContainerComponent
      updatePromptState={updatePromptState}
      marginBottom={30}>
      <View style={{padding: 10, paddingBottom: 70}}>
        {selectedDueCardState && (
          <WordModalDifficultSentence
            visible={selectedDueCardState}
            updateWordData={handleWordUpdate}
            onClose={() => setSelectedDueCardState(null)}
            deleteWord={() => handleDeleteWord(selectedDueCardState)}
          />
        )}
        <DifficultSentencesSegmentHeader
          dueLength={toggleableSentencesState.length}
          allLength={difficultSentencesState.length}
          isShowDueOnly={isShowDueOnly}
          setIsShowDueOnly={setIsShowDueOnly}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          {generalTopicsAvailableState ? (
            <DifficultSentencesTopics
              generalTopicsAvailableState={generalTopicsAvailableState}
              handleShowThisTopicsSentences={handleShowThisTopicsSentences}
              selectedGeneralTopicState={selectedGeneralTopicState}
            />
          ) : null}
          <DifficultSentencesWordNavigator
            handleNavigationToWords={handleNavigationToWords}
            numberOfWords={numberOfWords}
          />
          <View style={{marginTop: 10}}>
            {slicedRenderedSentenceArr.map((sentence, index) => (
              <DifficultSentenceComponent
                key={sentence.id}
                toggleableSentencesStateLength={toggleableSentencesStateLength}
                addSnippet={handleAddSnippet}
                updateSentenceData={updateSentenceDataScreenLevel}
                removeSnippet={handleRemoveSnippet}
                sentenceBeingHighlightedState={sentenceBeingHighlightedState}
                setSentenceBeingHighlightedState={
                  setSentenceBeingHighlightedState
                }
                navigation={navigation}
                sliceArrState={sliceArrState}
                setSliceArrState={setSliceArrState}
                realCapacity={realCapacity}
                handleSelectWord={handleSelectWord}
                handleWordUpdate={handleWordUpdate}
                deleteWord={deleteWord}
                sentence={sentence}
                updatingSentenceState={updatingSentenceState}
                indexNum={index}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
