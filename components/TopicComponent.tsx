import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
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
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  return (
    <View
      style={{
        paddingBottom: 50,
      }}>
      <Text
        style={{
          margin: 20,
        }}>
        {topicName}
        <TouchableOpacity onPress={() => setIsContainerOpen(!isContainerOpen)}>
          <Text style={{marginLeft: 10, margin: 'auto'}}>Open</Text>
        </TouchableOpacity>
      </Text>
      {isContainerOpen && (
        <TopicContent
          topicName={topicName}
          isContainerOpen={isContainerOpen}
          japaneseLoadedContent={japaneseLoadedContent}
          japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
          pureWordsUnique={pureWordsUnique}
          structuredUnifiedData={structuredUnifiedData}
          setStructuredUnifiedData={setStructuredUnifiedData}
          japaneseLoadedWords={japaneseLoadedWords}
        />
      )}
    </View>
  );
};

export default TopicComponent;
