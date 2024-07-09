import {View} from 'react-native';
import MusicContent from './MusicContent';
import TopicHeader from './TopicHeader';

const SongComponent = ({
  topicName,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  japaneseLoadedWords,
  snippetsForSelectedTopic,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  topicData,
  handleOtherTopics,
}) => {
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
        japaneseLoadedWords={japaneseLoadedWords}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        snippetsForSelectedTopic={snippetsForSelectedTopic}
        saveWordFirebase={saveWordFirebase}
        topicData={topicData}
      />
    </View>
  );
};

export default SongComponent;
