import {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';

const TopicComponent = ({
  topicName,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  targetLanguageLoadedWords,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  handleOtherTopics,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
  setSelectedSnippetsState,
  loadedContent,
  loadedSnippets,
}) => (
  <View
    style={{
      paddingBottom: 50,
    }}>
    <TopicHeader topicName={topicName} handleOtherTopics={handleOtherTopics} />
    <TopicContent
      topicName={topicName}
      pureWordsUnique={pureWordsUnique}
      structuredUnifiedData={structuredUnifiedData}
      setStructuredUnifiedData={setStructuredUnifiedData}
      targetLanguageLoadedWords={targetLanguageLoadedWords}
      addSnippet={addSnippet}
      removeSnippet={removeSnippet}
      saveWordFirebase={saveWordFirebase}
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
