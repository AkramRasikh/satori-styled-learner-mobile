import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import useData from '../../context/Data/useData';
import {View} from 'react-native';
import {storeDataLocalStorage} from '../../helper-functions/local-storage-utils';
import {content} from '../../refs';

const ContentScreen = () => {
  const route = useRoute();

  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState(null);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);
  const [updatePromptState, setUpdatePromptState] = useState('');

  const {languageSelectedState} = useLanguageSelector();
  const dataStorageKeyPrefix = `${languageSelectedState}-data-`;
  const {
    targetLanguageSnippetsState,
    targetLanguageLoadedContentMasterState,
    setTargetLanguageLoadedContentMasterState,
    updateSentenceData,
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

  const updateTopicMetaData = async ({topicName, fieldToUpdate}) => {
    try {
      const resObj = await updateCreateReviewHistory({
        contentEntry: topicName,
        fieldToUpdate,
        language: languageSelectedState,
      });
      if (resObj) {
        const thisTopicData = targetLanguageLoadedContentMasterState.find(
          topic => topic.title === topicName,
        );
        const filterTopics = targetLanguageLoadedContentMasterState.filter(
          topic => topic.title !== topicName,
        );
        const newTopicState = {...thisTopicData, ...resObj};
        const updatedContentState = [...filterTopics, newTopicState];
        setTargetLanguageLoadedContentMasterState(updatedContentState);
        await storeDataLocalStorage(
          dataStorageKeyPrefix + content,
          updatedContentState,
        );
        setSelectedContentState(newTopicState);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
      }
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
          updateTopicMetaData={updateTopicMetaData}
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
