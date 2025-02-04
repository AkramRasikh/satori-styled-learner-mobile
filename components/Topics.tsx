import React, {useState} from 'react';
import TopicTitleButton from './TopicTitleButton';
import {View} from 'react-native';
import {FAB} from 'react-native-paper';

const Topics = ({
  allTopicsMetaDataState,
  selectedGeneralTopicState,
  handleShowGeneralTopic,
  handleShowTopic,
  setSelectedGeneralTopicState,
}) => {
  const [showMediaContentState, setShowMediaContentState] = useState('');
  const handleOnPress = title => {
    if (!selectedGeneralTopicState) {
      handleShowGeneralTopic(title);
    } else {
      handleShowTopic(title);
    }
  };
  const clearAllStates = () => {
    setSelectedGeneralTopicState('');
    setShowMediaContentState('');
    handleShowGeneralTopic('');
  };

  const handleShowMedia = () => {
    if (showMediaContentState === 'media') {
      clearAllStates();
    } else {
      setSelectedGeneralTopicState('');
      setShowMediaContentState('media');
    }
  };

  const handleShowContent = () => {
    if (showMediaContentState === 'content') {
      clearAllStates();
    } else {
      setSelectedGeneralTopicState('');
      setShowMediaContentState('content');
    }
  };

  const mappedView = topicData => {
    const title = topicData.title;
    const isCore = topicData.isCore;
    const isDue = topicData.isDue;
    const futureReview = topicData.hasFutureReview;
    const isYoutube = topicData.isYoutube;
    const isGeneral = topicData.isGeneral;
    const hasAudio = topicData?.hasAudio;
    const isMediaContent = topicData?.isMediaContent;
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
          isNetflix={isMediaContent && !isYoutube}
        />
      );
    }

    return null;
  };

  let mediaGeneralTopicCount = 0;
  let contentGeneralTopicCount = 0;
  const mediaContent = [];
  const standardContent = [];

  allTopicsMetaDataState.forEach(i => {
    if (i.isMediaContent) {
      mediaContent.push(i);
      if (i.isGeneral) {
        mediaGeneralTopicCount = mediaGeneralTopicCount + 1;
      }
    } else {
      standardContent.push(i);
      if (i.isGeneral) {
        contentGeneralTopicCount = contentGeneralTopicCount + 1;
      }
    }
  });

  const isContent = showMediaContentState === 'content';
  const isMedia = showMediaContentState === 'media';

  return (
    <View style={{gap: 10}}>
      <View>
        <FAB
          icon={isContent ? 'folder-open' : 'plus'}
          label={`Content (${contentGeneralTopicCount}/${standardContent.length})`}
          onPress={handleShowContent}
        />
        {isContent && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              paddingTop: 10,
            }}>
            {standardContent.map(mappedView)}
          </View>
        )}
      </View>
      <View>
        <FAB
          icon={isMedia ? 'folder-open' : 'plus'}
          label={`Media (${mediaGeneralTopicCount}/${mediaContent.length})`}
          onPress={handleShowMedia}
        />
        {isMedia && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              paddingTop: 10,
            }}>
            {mediaContent.map(mappedView)}
          </View>
        )}
      </View>
    </View>
  );
};

export default Topics;
