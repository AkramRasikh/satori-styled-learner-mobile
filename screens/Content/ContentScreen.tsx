import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import useData from '../../context/Data/useData';

const ContentScreen = () => {
  const route = useRoute();

  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState(null);

  const {
    targetLanguageLoadedContentMasterState,
    updateSentenceViaContent,
    updateContentMetaData,
    updatePromptState,
  } = useData();

  const {targetSentenceId, selectedTopicIndex} = route.params;

  const selectedTopic =
    targetLanguageLoadedContentMasterState[selectedTopicIndex].title;

  useEffect(() => {
    setSelectedContentState(
      targetLanguageLoadedContentMasterState[selectedTopicIndex],
    );
  }, []);

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
      return true;
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
        />
      </View>
    </ScreenContainerComponent>
  );
};

export default ContentScreen;
