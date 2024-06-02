import {Text, View} from 'react-native';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../hooks/useGetCombinedAudioData';
import Sound from './Sound';

const TopicComponent = ({
  japaneseLoadedContent,
  topicName,
  japaneseLoadedContentFullMP3s,
}) => {
  const topicData = japaneseLoadedContent[topicName];
  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    mp3 => mp3.name === topicName,
  );

  const url = getFirebaseAudioURL(topicName);

  return (
    <View>
      <Text
        style={{
          margin: 20,
        }}>
        {topicName}
      </Text>
      {hasUnifiedMP3File && (
        <View>
          <Sound url={url} />
        </View>
      )}
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {topicData?.map((topicSentence, index) => {
          return (
            <Text
              key={index}
              style={{
                fontSize: 20,
              }}>
              {topicSentence.targetLang}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default TopicComponent;
