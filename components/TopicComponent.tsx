import {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';

const TopicComponent = ({
  topicName,
  targetLanguageLoadedContent,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  targetLanguageLoadedWords,
  snippetsForSelectedTopic,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  handleOtherTopics,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
}) => (
  <View
    style={{
      paddingBottom: 50,
    }}>
    <TopicHeader topicName={topicName} handleOtherTopics={handleOtherTopics} />
    <TopicContent
      topicName={topicName}
      targetLanguageLoadedContent={targetLanguageLoadedContent}
      pureWordsUnique={pureWordsUnique}
      structuredUnifiedData={structuredUnifiedData}
      setStructuredUnifiedData={setStructuredUnifiedData}
      targetLanguageLoadedWords={targetLanguageLoadedWords}
      addSnippet={addSnippet}
      snippetsForSelectedTopic={snippetsForSelectedTopic}
      removeSnippet={removeSnippet}
      saveWordFirebase={saveWordFirebase}
      updateTopicMetaData={updateTopicMetaData}
      updateSentenceData={updateSentenceData}
      triggerSentenceIdUpdate={triggerSentenceIdUpdate}
      setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
    />
  </View>
);

export default TopicComponent;
