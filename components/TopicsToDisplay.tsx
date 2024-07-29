import {Text, TouchableOpacity, View} from 'react-native';

const TopicsToDisplay = ({
  topicsToDisplay,
  japaneseLoadedContentFullMP3s,
  topicsToStudyState,
  isDueReview,
  isCoreContent,
  handleShowTopic,
}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {topicsToDisplay?.map(topic => {
        const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
          mp3 => mp3.name === topic,
        );
        const numberOfWordsToStudy = topicsToStudyState[topic];

        const thisTopicIsDue = isDueReview(topic, true);
        const isCoreStatus = isCoreContent(topic, true);

        return (
          <View key={topic}>
            <TouchableOpacity
              onPress={() => handleShowTopic(topic)}
              style={{
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 5,
                backgroundColor: thisTopicIsDue ? '#C34A2C' : 'transparent',
              }}>
              <Text>
                {topic} {!hasUnifiedMP3File ? '🔕' : ''}{' '}
                {numberOfWordsToStudy ? (
                  <Text>({numberOfWordsToStudy})</Text>
                ) : null}
                {isCoreStatus ? <Text> 🧠</Text> : null}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default TopicsToDisplay;
