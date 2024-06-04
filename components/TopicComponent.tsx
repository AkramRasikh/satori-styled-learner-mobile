import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import TopicContent from './TopicContent';

const TopicComponent = ({
  topicName,
  japaneseLoadedContent,
  japaneseLoadedContentFullMP3s,
  pureWordsUnique,
}) => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  return (
    <View>
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
        />
      )}
    </View>
  );
};

export default TopicComponent;
