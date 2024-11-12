import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';

import TopicContent from '../../components/TopicContent';
import LoadingScreen from '../../components/LoadingScreen';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';

import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import useData from '../../context/Data/useData';
import {View} from 'react-native';

const ContentScreen = () => {
  const route = useRoute();

  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState(null);
  const [selectedContentState, setSelectedContentState] = useState({});
  const [
    targetLanguageLoadedContentState,
    setTargetLanguageLoadedContentState,
  ] = useState([]);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);
  const [updatePromptState, setUpdatePromptState] = useState('');

  const {languageSelectedState} = useLanguageSelector();

  const {targetLanguageLoadedContentMaster, targetLanguageSnippetsState} =
    useData();
  const {selectedTopic, targetSentenceId} = route.params;

  useEffect(() => {
    setSelectedContentState(
      targetLanguageLoadedContentMaster.find(
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
        const thisTopicData = targetLanguageLoadedContentState.find(
          topic => topic.title === topicName,
        );
        const filterTopics = targetLanguageLoadedContentState.filter(
          topic => topic.title !== topicName,
        );
        const newTopicState = {...thisTopicData, ...resObj};
        setTargetLanguageLoadedContentState([...filterTopics, newTopicState]);
        setSelectedContentState(newTopicState);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
      }
    } catch (error) {
      setUpdatePromptState(`Error updating ${topicName}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  const updateSentenceData = async ({topicName, sentenceId, fieldToUpdate}) => {
    try {
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
        language: languageSelectedState,
      });

      if (resObj) {
        const thisTopicDataIndex = targetLanguageLoadedContentState.findIndex(
          topic => topic.title === topicName,
        );

        const thisTopicData =
          targetLanguageLoadedContentState[thisTopicDataIndex];

        const thisTopicUpdateContent = thisTopicData.content.map(
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

        const newTopicState = {
          ...thisTopicData,
          content: thisTopicUpdateContent,
        };

        const filteredTopics = targetLanguageLoadedContentState.map(topic => {
          if (topic.title !== topicName) {
            return topic;
          }
          return newTopicState;
        });
        setTargetLanguageLoadedContentState(filteredTopics);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
        setTriggerSentenceIdUpdate({id: sentenceId, fieldToUpdate: resObj});
        setSelectedContentState(newTopicState);
        setSelectedSnippetsState(selectedContentState.snippets);
      }
    } catch (error) {
      console.log('## updateSentenceData', {error});
      setUpdatePromptState(`Error updating sentence for ${topicName}!`);
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
          updateSentenceData={updateSentenceData}
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
