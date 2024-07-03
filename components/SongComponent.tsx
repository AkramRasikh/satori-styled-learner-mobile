import {Text, View} from 'react-native';
import MusicContent from './MusicContent';

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
}) => {
  return (
    <View
      style={{
        paddingBottom: 50,
      }}>
      <Text
        style={{
          margin: 20,
          fontSize: 18,
          fontWeight: 'bold',
          alignSelf: 'center',
        }}>
        {topicName}
      </Text>
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
