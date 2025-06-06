import React, {useEffect, useRef, useState} from 'react';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
  getFirebaseVideoURL,
} from '../../hooks/useGetCombinedAudioData';
import TopicContentLoader from '../TopicContentLoader';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import useSetSecondsToSentenceIds from '../../hooks/useSetSecondsToSentenceIds';
import TopicContentAudioMode from './TopicContentAudioMode';
import TopicContentVideoMode from './TopicContentVideoMode';
import {TopicContentVideoProvider} from './context/TopicContentVideoProvider';
import {TopicContentAudioProvider} from './context/TopicContentAudioProvider';
import Sound from 'react-native-sound';
import useOpenGoogleTranslate from '../../hooks/useOpenGoogleTranslate';
import useInitAudio from '../../hooks/useInitAudio';
import checkIfVideoExists from '../../api/check-if-video-exists';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';

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
  dueSentences,
}) => {
  const [secondsToSentencesMapState, setSecondsToSentencesMapState] = useState<
    string[]
  >([]);
  const [isVideoModeState, setIsVideoModeState] = useState(false);

  const [highlightTargetTextState, setHighlightTargetTextState] = useState('');
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);
  const [hasVideoCheckState, setHasVideoCheckState] = useState(null);

  const {languageSelectedState} = useLanguageSelector();

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogle = topicSentenceTargetLang => {
    openGoogleTranslateApp(topicSentenceTargetLang);
  };
  const soundRef = useRef<Sound>(null);

  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const {isLoaded} = useInitAudio({soundRef, topicName, url});

  const content = loadedContent.content;
  const origin = loadedContent.origin;
  const realStartTime = loadedContent?.realStartTime;
  const hasAudio = loadedContent?.hasAudio;
  const isDurationAudioLoaded = loadedContent?.isDurationAudioLoaded;

  useEffect(() => {
    if (hasVideoCheckState === null) {
      checkIfVideoExists(
        getFirebaseVideoURL(
          getGeneralTopicName(topicName),
          languageSelectedState,
        ),
      )
        .then(res => {
          if (res) {
            setHasVideoCheckState(true);
          } else {
            setHasVideoCheckState(false);
          }
        })
        .catch(() => {});
    }
  }, [hasVideoCheckState, languageSelectedState]);

  const hasContentToReview = content?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  const isMediaContent = origin === 'netflix' || origin === 'youtube';

  const soundDuration = soundRef?.current?._duration || 0;

  const handleVideoMode = (switchToVideoMode: boolean) => {
    setIsVideoModeState(switchToVideoMode);
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

  if (isVideoModeState && hasVideoCheckState) {
    return (
      <TopicContentVideoProvider
        realStartTime={realStartTime}
        secondsToSentencesMapState={secondsToSentencesMapState}
        loadedContent={loadedContent}>
        <TopicContentVideoMode
          topicName={topicName}
          updateTopicMetaData={updateTopicMetaData}
          updateSentenceData={updateSentenceData}
          loadedContent={loadedContent}
          breakdownSentenceFunc={breakdownSentenceFunc}
          handleVideoMode={handleVideoMode}
          handleIsCore={handleIsCore}
          handleBulkReviews={handleBulkReviews}
          highlightTargetTextState={highlightTargetTextState}
          secondsToSentencesMapState={secondsToSentencesMapState}
          hasContentToReview={hasContentToReview}
          handleOpenGoogle={handleOpenGoogle}
          hasVideo={hasVideoCheckState}
        />
      </TopicContentVideoProvider>
    );
  }

  return (
    <TopicContentAudioProvider
      topicName={topicName}
      isVideoModeState={isVideoModeState}
      soundRef={soundRef}
      secondsToSentencesMapState={secondsToSentencesMapState}
      loadedContent={loadedContent}>
      <TopicContentAudioMode
        topicName={topicName}
        updateTopicMetaData={updateTopicMetaData}
        updateSentenceData={updateSentenceData}
        loadedContent={loadedContent}
        breakdownSentenceFunc={breakdownSentenceFunc}
        handleBulkReviews={handleBulkReviews}
        handleIsCore={handleIsCore}
        handleVideoMode={handleVideoMode}
        secondsToSentencesMapState={secondsToSentencesMapState}
        highlightTargetTextState={highlightTargetTextState}
        formattedData={content}
        hasContentToReview={hasContentToReview}
        url={url}
        handleOpenGoogle={handleOpenGoogle}
        dueSentences={dueSentences}
        hasVideo={hasVideoCheckState}
      />
    </TopicContentAudioProvider>
  );
};

export default TopicContent;
