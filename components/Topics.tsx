import React, {useState} from 'react';
import TopicTitleButton from './TopicTitleButton';
import {View} from 'react-native';
import {FAB} from 'react-native-paper';
import {languageEmojiKey} from './HomeContainerToSentencesOrWords';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';

const TopicSectionContainer = ({
  label,
  onPress,
  topicArr,
  handleOnPress,
  selectedGeneralTopicState,
  condition,
}) => {
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
  return (
    <View>
      <FAB
        icon={condition ? 'folder-open' : 'plus'}
        label={label}
        onPress={onPress}
        variant="surface"
      />
      {condition && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            paddingTop: 10,
          }}>
          {topicArr.map(mappedView)}
        </View>
      )}
    </View>
  );
};

const Topics = ({
  allTopicsMetaDataState,
  selectedGeneralTopicState,
  handleShowGeneralTopic,
  handleShowTopic,
  setSelectedGeneralTopicState,
  showMediaContentState,
  setShowMediaContentState,
}) => {
  const {languageSelectedState} = useLanguageSelector();
  const handleOnPress = title => {
    if (!selectedGeneralTopicState) {
      handleShowGeneralTopic(title);
    } else {
      handleShowTopic(title);
    }
  };
  const resetState = () => {
    if (selectedGeneralTopicState) {
      setSelectedGeneralTopicState('');
    } else {
      setSelectedGeneralTopicState('');
      setShowMediaContentState('');
      handleShowGeneralTopic('');
    }
  };

  const handleShowMedia = () => {
    if (showMediaContentState === 'media') {
      resetState();
    } else {
      setSelectedGeneralTopicState('');
      setShowMediaContentState('media');
    }
  };

  const handleShowContent = () => {
    if (showMediaContentState === 'content') {
      resetState();
    } else {
      setSelectedGeneralTopicState('');
      setShowMediaContentState('content');
    }
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

  const flagEmoji = languageEmojiKey[languageSelectedState];
  const isContent = showMediaContentState === 'content';
  const isMedia = showMediaContentState === 'media';
  const selectedContentLabel = isContent ? ` ${selectedGeneralTopicState}` : '';
  const selectedMediaLabel = isMedia ? ` ${selectedGeneralTopicState}` : '';

  const contentLabel = `${flagEmoji} Content (${contentGeneralTopicCount}/${standardContent.length})${selectedContentLabel}`;
  const mediaLabel = `${flagEmoji} Media (${mediaGeneralTopicCount}/${mediaContent.length})${selectedMediaLabel}`;

  return (
    <View style={{gap: 10}}>
      <TopicSectionContainer
        label={contentLabel}
        onPress={handleShowContent}
        topicArr={standardContent}
        handleOnPress={handleOnPress}
        selectedGeneralTopicState={selectedGeneralTopicState}
        condition={isContent}
      />
      <TopicSectionContainer
        label={mediaLabel}
        onPress={handleShowMedia}
        topicArr={mediaContent}
        handleOnPress={handleOnPress}
        selectedGeneralTopicState={selectedGeneralTopicState}
        condition={isMedia}
      />
    </View>
  );
};

export default Topics;
