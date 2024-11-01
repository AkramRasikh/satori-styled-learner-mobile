import React from 'react';
import TopicTitleButton from './TopicTitleButton';
import {View} from 'react-native';

const Topics = ({
  allTopicsMetaDataState,
  selectedGeneralTopicState,
  handleShowGeneralTopic,
  handleShowTopic,
}) => {
  const handleOnPress = title => {
    if (!selectedGeneralTopicState) {
      handleShowGeneralTopic(title);
    } else {
      handleShowTopic(title);
    }
  };
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {allTopicsMetaDataState?.map(topicData => {
        const title = topicData.title;
        const isCore = topicData.isCore;
        const isDue = topicData.isDue;
        const futureReview = topicData.hasFutureReview;
        const isYoutube = topicData.isYoutube;
        const isGeneral = topicData.isGeneral;
        const hasAudio = topicData?.hasAudio;
        const isSelectedSubsetOfGeneralTopic =
          topicData?.generalTopic === selectedGeneralTopicState;
        const showGeneralTopics = isGeneral && !selectedGeneralTopicState;

        const generalTopicMode = !isGeneral && isSelectedSubsetOfGeneralTopic;

        if (showGeneralTopics || generalTopicMode) {
          return (
            <TopicTitleButton
              key={title}
              onPress={() => handleOnPress(title)}
              testID={title}
              isDue={isDue}
              futureReview={futureReview}
              title={title}
              isCore={isCore}
              isYoutube={isYoutube}
              isGeneral={isGeneral}
              hasAudio={hasAudio}
            />
          );
        }

        return null;
      })}
    </View>
  );
};

export default Topics;
