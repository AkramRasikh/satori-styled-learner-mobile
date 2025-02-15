import React, {useEffect, useState} from 'react';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../../hooks/useGetCombinedAudioData';
import TopicContentLoader from '../TopicContentLoader';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import useSetSecondsToSentenceIds, {
  mapSentenceIdsToSeconds,
} from '../../hooks/useSetSecondsToSentenceIds';
import useTopicContentAudio from './context/useTopicContentAudio';
import TopicContentAudioMode from './TopicContentAudioMode';
import TopicContentVideoMode from './TopicContentVideoMode';
import {TopicContentVideoProvider} from './context/TopicContentVideoProvider';

const TopicContent = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  loadedContent,
  targetSentenceId,
  breakdownSentenceFunc,
  handleIsCore,
  handleBulkReviews,
  updateContentMetaDataIsLoadedDispatch,
}) => {
  const [secondsToSentencesMapState, setSecondsToSentencesMapState] = useState<
    string[]
  >([]);

  const [highlightTargetTextState, setHighlightTargetTextState] = useState('');
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);

  const {languageSelectedState} = useLanguageSelector();

  const {isLoaded, soundRef, isVideoModeState, setIsVideoModeState} =
    useTopicContentAudio();

  const content = loadedContent.content;
  const origin = loadedContent.origin;
  const realStartTime = loadedContent?.realStartTime;
  const hasAudio = loadedContent?.hasAudio;
  const isDurationAudioLoaded = loadedContent?.isDurationAudioLoaded;

  const hasContentToReview = content?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  const isMediaContent = origin === 'netflix' || origin === 'youtube';

  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const soundDuration = soundRef?.current?._duration || 0;

  const handleVideoMode = (switchToVideoMode: boolean) => {
    if (switchToVideoMode) {
      setIsVideoModeState(true);
      setSecondsToSentencesMapState(
        mapSentenceIdsToSeconds({
          content,
          duration: soundDuration,
          isVideoModeState: true,
          realStartTime,
        }),
      );
    } else {
      setIsVideoModeState(false);
      setSecondsToSentencesMapState(
        mapSentenceIdsToSeconds({
          content,
          duration: soundDuration,
          isVideoModeState: false,
          realStartTime,
        }),
      );
    }
  };

  useEffect(() => {
    if (targetSentenceId && !isLoaded) {
      setHighlightTargetTextState(targetSentenceId);
    }
  }, [targetSentenceId, isLoaded]);

  useGetCombinedAudioData({
    hasAudio,
    content,
    setAudioLoadingProgress,
    isMediaContent,
    soundDuration,
    updateContentMetaDataIsLoadedDispatch,
    isDurationAudioLoaded,
  });

  useSetSecondsToSentenceIds({
    content,
    soundDuration,
    secondsToSentencesMapState,
    setSecondsToSentencesMapState,
    isVideoModeState,
    realStartTime,
  });

  if (!isLoaded && !isDurationAudioLoaded) {
    return (
      <TopicContentLoader
        audioLoadingProgress={audioLoadingProgress}
        topicDataLengths={content.length}
        topicName={topicName}
        isMediaContent={isMediaContent}
      />
    );
  }

  if (isVideoModeState) {
    return (
      <TopicContentVideoProvider realStartTime={realStartTime}>
        <TopicContentVideoMode
          topicName={topicName}
          updateTopicMetaData={updateTopicMetaData}
          updateSentenceData={updateSentenceData}
          loadedContent={loadedContent}
          breakdownSentenceFunc={breakdownSentenceFunc}
          handleVideoMode={handleVideoMode}
          handleIsCore={handleIsCore}
          handleBulkReviews={handleBulkReviews}
          formattedData={content}
          highlightTargetTextState={highlightTargetTextState}
          secondsToSentencesMapState={secondsToSentencesMapState}
          hasContentToReview={hasContentToReview}
        />
      </TopicContentVideoProvider>
    );
  }

  return (
    <TopicContentAudioMode
      topicName={topicName}
      updateTopicMetaData={updateTopicMetaData}
      updateSentenceData={updateSentenceData}
      loadedContent={loadedContent}
      breakdownSentenceFunc={breakdownSentenceFunc}
      handleBulkReviews={handleBulkReviews}
      handleIsCore={handleIsCore}
      content={content}
      handleVideoMode={handleVideoMode}
      secondsToSentencesMapState={secondsToSentencesMapState}
      highlightTargetTextState={highlightTargetTextState}
      formattedData={content}
      hasContentToReview={hasContentToReview}
      url={url}
    />
  );
};

export default TopicContent;
