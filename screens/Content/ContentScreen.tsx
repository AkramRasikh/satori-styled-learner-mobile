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
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);

  const {
    targetLanguageSnippetsState,
    targetLanguageLoadedContentMasterState,
    updateSentenceViaContent,
    updateContentMetaData,
    updatePromptState,
  } = useData();
  const {targetSentenceId, selectedTopicIndex} = route.params;

  const selectedTopic =
    targetLanguageLoadedContentMasterState[selectedTopicIndex].title;

  useEffect(() => {
    const contentState =
      targetLanguageLoadedContentMasterState[selectedTopicIndex];
    setSelectedContentState(
      targetLanguageLoadedContentMasterState[selectedTopicIndex],
    );
    setSelectedSnippetsState(
      targetLanguageSnippetsState?.filter(
        item => item.topicName === contentState.title,
      ),
    );
  }, []);

  const updateMetaData = async ({topicName, fieldToUpdate}) => {
    const thisUpdatedContent = await updateContentMetaData({
      topicName,
      fieldToUpdate,
      contentIndex: selectedTopicIndex,
    });
    setSelectedContentState(thisUpdatedContent);
  };

  const updateSentenceDataFunc = async ({sentenceId, fieldToUpdate}) => {
    try {
      const updatedSelectedState = await updateSentenceViaContent({
        topicName: selectedTopic,
        sentenceId,
        fieldToUpdate,
        contentIndex: selectedTopicIndex,
      });
      setSelectedContentState(updatedSelectedState);
      setTriggerSentenceIdUpdate(sentenceId);
    } catch (error) {
      console.log('## updateSentenceData', {error});
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
          loadedSnippets={selectedSnippetsState}
          updateTopicMetaData={updateMetaData}
          updateSentenceData={updateSentenceDataFunc}
          triggerSentenceIdUpdate={triggerSentenceIdUpdate}
          setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
          setSelectedSnippetsState={setSelectedSnippetsState}
          targetSentenceId={targetSentenceId}
        />
      </View>
    </ScreenContainerComponent>
  );
};

export default ContentScreen;
