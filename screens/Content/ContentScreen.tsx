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
  const [updatePromptState, setUpdatePromptState] = useState('');

  const {
    targetLanguageSnippetsState,
    targetLanguageLoadedContentMasterState,
    updateSentenceData,
    updateContentMetaData,
  } = useData();
  const {selectedTopic, targetSentenceId} = route.params;

  useEffect(() => {
    setSelectedContentState(
      targetLanguageLoadedContentMasterState.find(
        contentItem => contentItem.title === selectedTopic,
      ),
    );
    setSelectedSnippetsState(
      targetLanguageSnippetsState?.filter(
        item => item.topicName === selectedTopic,
      ),
    );
  }, []);

  const updateMetaData = async ({topicName, fieldToUpdate}) => {
    try {
      const thisUpdatedContent = await updateContentMetaData({
        topicName,
        fieldToUpdate,
      });
      setSelectedContentState(thisUpdatedContent);
      setUpdatePromptState(`${topicName} updated!`);
      setTimeout(() => setUpdatePromptState(''), 3000);
    } catch (error) {
      setUpdatePromptState(`Error updating ${topicName}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  const updateSentenceDataFunc = async ({sentenceId, fieldToUpdate}) => {
    try {
      const resObj = await updateSentenceData({
        topicName: selectedTopic,
        sentenceId,
        fieldToUpdate,
        isAdhoc: false,
      });

      if (resObj) {
        const thisTopicUpdateContent = selectedContentState.content.map(
          sentenceData => {
            if (sentenceData.id === sentenceId) {
              return {
                ...sentenceData,
                ...resObj,
              };
            }
            return sentenceData;
          },
        );
        setUpdatePromptState(`${selectedTopic} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
        setTriggerSentenceIdUpdate({id: sentenceId, fieldToUpdate: resObj});
        setSelectedContentState({
          ...selectedContentState,
          content: thisTopicUpdateContent,
        });
      }
    } catch (error) {
      console.log('## updateSentenceData', {error});
      setUpdatePromptState(`Error updating sentence for ${selectedTopic}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
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
