import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import PillButton from '../../components/PillButton';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import DifficultSentenceMapContainer from '../../components/DifficultSentenceMapContainer';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';
import WordModalDifficultSentence from '../../components/WordModalDifficultSentence';

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

  const {
    updateSentenceData,
    updatePromptState,
    addSnippet,
    removeSnippet,
    pureWords,
  } = useData();

  const {
    difficultSentencesState,
    removeDifficultSentenceFromState,
    updateDifficultSentence,
    refreshDifficultSentencesInfo,
  } = useDifficultSentences();

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

  const sortObj = reducedObj => {
    const keys = Object.keys(reducedObj);
    keys.sort();

    const sortedObj = {};
    keys.forEach(key => {
      sortedObj[key] = reducedObj[key];
    });
    return sortedObj;
  };

  const countOccurrences = arr =>
    sortObj(
      arr.reduce((acc, current) => {
        acc[current] = (acc[current] || 0) + 1;
        return acc;
      }, {}),
    );

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
          countOccurrences(toggleableSentenceTopics),
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
          countOccurrences(generalTopicsCollectively),
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
    setSelectedDueCardState(selectingWord);
  };

  const handleDeleteWord = () => {
    console.log('## handleDeleteWord');
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
        countOccurrences(toggleableSentenceTopics),
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

  return (
    <ScreenContainerComponent
      updatePromptState={updatePromptState}
      marginBottom={30}>
      <View style={{padding: 10, paddingBottom: 30}}>
        <View>
          <Text>
            Difficult Sentences: ({toggleableSentencesState.length}/
            {difficultSentencesState.length})
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 5,
          }}>
          <PillButton
            isShowDueOnly={isShowDueOnly}
            setIsShowDueOnly={setIsShowDueOnly}
          />
          <View>
            <Button title="↺" onPress={handleRefreshFunc} />
          </View>
        </View>
        {selectedDueCardState && (
          <WordModalDifficultSentence
            visible={selectedDueCardState}
            onClose={() => setSelectedDueCardState(null)}
            deleteWord={() => handleDeleteWord(selectedDueCardState)}
          />
        )}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          {generalTopicsAvailableState ? (
            <View
              style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
              {Object.entries(generalTopicsAvailableState).map(
                ([generalTopic, numberOfSentences]) => {
                  return (
                    <View
                      key={generalTopic}
                      style={{
                        backgroundColor:
                          generalTopic === selectedGeneralTopicState
                            ? '#ff9999'
                            : 'grey',
                        margin: 5,
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          handleShowThisTopicsSentences(generalTopic)
                        }>
                        <Text>
                          {generalTopic} ({numberOfSentences})
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                },
              )}
            </View>
          ) : null}

          <DifficultSentenceMapContainer
            toggleableSentencesState={toggleableSentencesState.slice(
              0,
              sliceArrState,
            )}
            addSnippet={handleAddSnippet}
            updateSentenceData={updateSentenceDataScreenLevel}
            removeSnippet={handleRemoveSnippet}
            pureWords={pureWords}
            sentenceBeingHighlightedState={sentenceBeingHighlightedState}
            setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
            navigation={navigation}
            sliceArrState={sliceArrState}
            setSliceArrState={setSliceArrState}
            realCapacity={realCapacity}
            handleSelectWord={handleSelectWord}
          />
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
