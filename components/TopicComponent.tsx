import {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';
import {useEffect} from 'react';

const TopicComponent = ({
  topicName,
  japaneseLoadedContent,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  japaneseLoadedWords,
  snippetsForSelectedTopic,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  handleOtherTopics,
  hasWordsToStudy,
  japaneseWordsToStudyState,
  getThisTopicsWordsFunc,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
}) => {
  const prefixName = topicName.split('-')[0];
  const hasWordsInState = japaneseWordsToStudyState?.hasOwnProperty(prefixName);

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
        japaneseLoadedContent={japaneseLoadedContent}
        pureWordsUnique={pureWordsUnique}
        structuredUnifiedData={structuredUnifiedData}
        setStructuredUnifiedData={setStructuredUnifiedData}
        japaneseLoadedWords={japaneseLoadedWords}
        addSnippet={addSnippet}
        snippetsForSelectedTopic={snippetsForSelectedTopic}
        removeSnippet={removeSnippet}
        saveWordFirebase={saveWordFirebase}
        wordsToStudy={
          hasWordsInState ? japaneseWordsToStudyState[prefixName] : null
        }
        updateTopicMetaData={updateTopicMetaData}
        updateSentenceData={updateSentenceData}
        triggerSentenceIdUpdate={triggerSentenceIdUpdate}
        setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
      />
    </View>
  );
};

export default TopicComponent;
