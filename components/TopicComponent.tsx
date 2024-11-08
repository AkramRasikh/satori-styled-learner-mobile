import React, {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';

const TopicComponent = ({
  topicName,
  targetLanguageLoadedWords,
  addSnippet,
  removeSnippet,
  handleOtherTopics,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
  setSelectedSnippetsState,
  loadedContent,
  loadedSnippets,
}) => (
  <View>
    <TopicHeader topicName={topicName} handleOtherTopics={handleOtherTopics} />
    <TopicContent
      topicName={topicName}
      targetLanguageLoadedWords={targetLanguageLoadedWords}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      updateTopicMetaData={updateTopicMetaData}
      updateSentenceData={updateSentenceData}
      triggerSentenceIdUpdate={triggerSentenceIdUpdate}
      setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
      loadedContent={loadedContent}
      loadedSnippets={loadedSnippets}
      setSelectedSnippetsState={setSelectedSnippetsState}
    />
  </View>
);

export default TopicComponent;
