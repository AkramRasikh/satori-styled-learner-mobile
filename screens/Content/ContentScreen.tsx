import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import useData from '../../context/Data/useData';
import useDifficultSentences from '../../context/DifficultSentences/useDifficultSentencesProvider';

const ContentScreen = () => {
  const route = useRoute();

  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState(null);

  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );

  const {
    updateSentenceViaContent,
    updateContentMetaData,
    updatePromptState,
    breakdownSentence,
  } = useData();

  const {
    removeDifficultSentenceFromState,
    updateDifficultSentence,
    addToSentenceToDifficultSentences,
  } = useDifficultSentences();

  const {targetSentenceId, selectedTopicIndex} = route.params;

  const selectedTopic =
    targetLanguageLoadedContentMasterState[selectedTopicIndex].title;

  useEffect(() => {
    setSelectedContentState(
      targetLanguageLoadedContentMasterState[selectedTopicIndex],
    );
  }, []);

  const getThisSentenceData = (state, sentenceId) =>
    state.find(sentence => sentence.id === sentenceId);

  const updateMetaData = async ({topicName, fieldToUpdate}) => {
    const thisUpdatedContent = await updateContentMetaData({
      topicName,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    if (thisUpdatedContent) {
      setSelectedContentState(thisUpdatedContent);
    }
  };

  const updateDifficultSentencesProvider = (
    updatedContentState,
    sentenceId,
  ) => {
    const prevState = getThisSentenceData(
      selectedContentState.content,
      sentenceId,
    );
    const newState = getThisSentenceData(
      updatedContentState.content,
      sentenceId,
    );

    const initialSentenceDueState = prevState?.reviewData?.due;
    const updatedSentenceDueState = newState?.reviewData?.due;
    const isNewlyDifficulty =
      !initialSentenceDueState && updatedSentenceDueState;
    const isUpdatingDifficulty =
      initialSentenceDueState && updatedSentenceDueState;
    const isRemoveDifficulty =
      initialSentenceDueState && !updatedSentenceDueState;

    if (isNewlyDifficulty) {
      addToSentenceToDifficultSentences({
        sentenceData: newState,
      });
    } else if (isUpdatingDifficulty) {
      updateDifficultSentence({
        sentenceId,
        updateDataRes: newState,
      });
    } else if (isRemoveDifficulty) {
      removeDifficultSentenceFromState(sentenceId);
    }
  };

  const updateSentenceDataFunc = async ({sentenceId, fieldToUpdate}) => {
    const updatedSelectedState = await updateSentenceViaContent({
      topicName: selectedTopic,
      sentenceId,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    if (updatedSelectedState) {
      setSelectedContentState(updatedSelectedState);
      setTriggerSentenceIdUpdate(sentenceId);
      updateDifficultSentencesProvider(updatedSelectedState, sentenceId);
      return true;
    }
  };
  const breakdownSentenceFunc = async ({
    topicName,
    sentenceId,
    language,
    targetLang,
    contentIndex,
  }) => {
    const updatedSelectedState = await breakdownSentence({
      topicName,
      sentenceId,
      language,
      targetLang,
      contentIndex,
    });
    if (updatedSelectedState) {
      setSelectedContentState(updatedSelectedState);
      setTriggerSentenceIdUpdate(sentenceId);
    }
  };

  if (!selectedTopic || !selectedContentState?.content) {
    return <LoadingScreen>Loading selected topic</LoadingScreen>;
  }

  return (
    <ScreenContainerComponent updatePromptState={updatePromptState}>
      <View style={{padding: 10}}>
        <TopicContent
          topicName={selectedTopic}
          loadedContent={selectedContentState}
          updateTopicMetaData={updateMetaData}
          updateSentenceData={updateSentenceDataFunc}
          triggerSentenceIdUpdate={triggerSentenceIdUpdate}
          setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
          targetSentenceId={targetSentenceId}
          breakdownSentenceFunc={breakdownSentenceFunc}
        />
      </View>
    </ScreenContainerComponent>
  );
};

export default ContentScreen;
