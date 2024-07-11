import {View} from 'react-native';
import TopicContent from './TopicContent';
import TopicHeader from './TopicHeader';
import {useEffect} from 'react';

const TopicComponent = ({
  topicName,
  japaneseLoadedContent,
  japaneseLoadedContentFullMP3s,
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
        japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
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
      />
    </View>
  );
};

export default TopicComponent;
