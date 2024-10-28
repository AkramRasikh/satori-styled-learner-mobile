import {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';
import {useEffect} from 'react';

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
  hasWordsToStudy,
  targetLanguageWordsToStudyState,
  getThisTopicsWordsFunc,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
}) => {
  const prefixName = topicName.split('-')[0];
  const hasWordsInState =
    targetLanguageWordsToStudyState?.hasOwnProperty(prefixName);

  useEffect(() => {
    if (hasWordsToStudy && !hasWordsInState) {
      getThisTopicsWordsFunc(prefixName);
    }
  }, []);

  return (
    <View
      style={{
        paddingBottom: 50,
      }}>
      <TopicHeader
        topicName={topicName}
        handleOtherTopics={handleOtherTopics}
      />
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
};

export default TopicComponent;
