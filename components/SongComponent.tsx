import {View} from 'react-native';
import MusicContent from './MusicContent';
import TopicHeader from './TopicHeader';
import {useEffect} from 'react';

const SongComponent = ({
  topicName,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  targetLanguageLoadedWords,
  snippetsForSelectedTopic,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  topicData,
  handleOtherTopics,
  japaneseWordsToStudyState,
  hasWordsToStudy,
  getThisTopicsWordsFunc,
}) => {
  const hasWordsInState = japaneseWordsToStudyState?.hasOwnProperty(topicName);

  useEffect(() => {
    if (hasWordsToStudy && !hasWordsInState) {
      getThisTopicsWordsFunc(topicName, true);
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
      <MusicContent
        topicName={topicName}
        pureWordsUnique={pureWordsUnique}
        structuredUnifiedData={structuredUnifiedData}
        setStructuredUnifiedData={setStructuredUnifiedData}
        targetLanguageLoadedWords={targetLanguageLoadedWords}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        snippetsForSelectedTopic={snippetsForSelectedTopic}
        saveWordFirebase={saveWordFirebase}
        topicData={topicData}
        wordsToStudy={
          hasWordsInState ? japaneseWordsToStudyState[topicName] : null
        }
      />
    </View>
  );
};

export default SongComponent;
