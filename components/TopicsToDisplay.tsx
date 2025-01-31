import {View} from 'react-native';
import {TopicTitleButton} from './TopicTitleButton';

const TopicsToDisplay = ({
  allTopicsMetaDataState,
  handleOnPress,
  selectedGeneralTopicState,
}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {allTopicsMetaDataState?.map(topic => {
        const hasAudio = topic.hasAudio;
        const isDue = topic.isDue;
        const isCore = topic.isCore;
        const hasFutureReview = topic.hasFutureReview;
        const generalTopicTitle = topic.generalTopic;
        const title = topic.title;
        const isYoutube = topic.isYoutube;

        if (selectedGeneralTopicState !== generalTopicTitle) return null;

        return (
          <TopicTitleButton
            key={title}
            onPress={() => handleOnPress(topic.title)}
            testID={title}
            isDue={isDue}
            futureReview={hasFutureReview}
            title={title}
            isCore={isCore}
            isYoutube={isYoutube}
            hasAudio={hasAudio}
          />
        );
      })}
    </View>
  );
};

export default TopicsToDisplay;
