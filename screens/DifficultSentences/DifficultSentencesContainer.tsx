import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import PillButton from '../../components/PillButton';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useData from '../../context/Data/useData';
import DifficultSentenceMapContainer from '../../components/DifficultSentenceMapContainer';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';

const DifficultSentencesContainer = ({navigation}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');
  const [selectedGeneralTopicState, setSelectedGeneralTopicState] =
    useState('');
  const [generalTopicsAvailableState, setGeneralTopicsAvailableState] =
    useState(null);
  const [sliceArrState, setSliceArrState] = useState(20);
  const [isShowDueOnly, setIsShowDueOnly] = useState(false);

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

  const countOccurrences = arr =>
    arr.reduce((acc, current) => {
      acc[current] = (acc[current] || 0) + 1;
      return acc;
    }, {});

  const handleRefreshFunc = () => {
    refreshDifficultSentencesInfo();
    setSelectedGeneralTopicState('');
    showDueInit(difficultSentencesState);
  };

  const isDueCheck = (sentence, todayDateObj) => {
    return (
      (sentence?.nextReview && sentence.nextReview < todayDateObj) ||
      new Date(sentence?.reviewData?.due) < todayDateObj
    );
  };

  const showDueInit = arr => {
    const todayDateObj = new Date();
    const toggleableSentenceTopics = [];
    const filteredForDueOnly = [...arr].filter(sentence => {
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
      setIsShowDueOnly(!isShowDueOnly);
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

  const getThisTopicsContent = topic => {
    const todayDateObj = new Date();

    const updatedToggleStateWithSelectedTopic = [
      ...difficultSentencesState,
    ].filter(i => {
      const thisTopic = i.generalTopic === topic;
      const timeCheckEligibility =
        (isShowDueOnly && isDueCheck(i, todayDateObj)) || !isShowDueOnly;
      return thisTopic && timeCheckEligibility;
    });
    setToggleableSentencesState(updatedToggleStateWithSelectedTopic);
  };

  const handleShowThisTopicsSentences = topic => {
    setSelectedGeneralTopicState(topic);
    getThisTopicsContent(topic);
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

    const updateDataRes = await updateSentenceData({
      isAdhoc,
      topicName,
      sentenceId,
      fieldToUpdate,
      contentIndex,
    });
    if (updateDataRes) {
      setToggleableSentencesState(prev =>
        prev.filter(sentenceData => sentenceData.id !== sentenceId),
      );
      if (isRemoveFromDifficultSentences) {
        removeDifficultSentenceFromState(sentenceId);
      } else {
        updateDifficultSentence({sentenceId, updateDataRes});
      }
    }
  };

  const showDueOnlyFunc = () => {
    if (!isShowDueOnly) {
      showDueInit(toggleableSentencesState);
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
      setToggleableSentencesState(difficultSentencesState);
      setIsShowDueOnly(!isShowDueOnly);
    }
  };

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
            showDueOnlyFunc={showDueOnlyFunc}
          />
          <View>
            <Button title="↺" onPress={handleRefreshFunc} />
          </View>
        </View>
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
          />
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
