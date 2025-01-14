import React, {useEffect, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
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

  const handleRefreshFunc = () => {
    refreshDifficultSentencesInfo();
    showDueInit(difficultSentencesState);
  };

  const showDueInit = arr => {
    const todayDateObj = new Date();
    const filteredForDueOnly = [...arr].filter(sentence => {
      if (sentence?.nextReview) {
        return sentence.nextReview < todayDateObj;
      } else {
        return new Date(sentence?.reviewData?.due) < todayDateObj;
      }
    });
    if (filteredForDueOnly?.length > 0) {
      setToggleableSentencesState(filteredForDueOnly);
      setIsShowDueOnly(!isShowDueOnly);
    } else {
      setToggleableSentencesState(difficultSentencesState);
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
