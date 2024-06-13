import {Text, View} from 'react-native';
import TopicContent from './TopicContent';

const TopicComponent = ({
  topicName,
  japaneseLoadedContent,
  japaneseLoadedContentFullMP3s,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  japaneseLoadedWords,
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
      <TopicContent
        topicName={topicName}
        japaneseLoadedContent={japaneseLoadedContent}
        japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
        pureWordsUnique={pureWordsUnique}
        structuredUnifiedData={structuredUnifiedData}
        setStructuredUnifiedData={setStructuredUnifiedData}
        japaneseLoadedWords={japaneseLoadedWords}
      />
    </View>
  );
};

export default TopicComponent;
