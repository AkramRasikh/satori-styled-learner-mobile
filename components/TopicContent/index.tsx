import React, {useEffect, useRef, useState} from 'react';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../../hooks/useGetCombinedAudioData';
import TopicContentLoader from '../TopicContentLoader';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import useSetSecondsToSentenceIds, {
  mapSentenceIdsToSeconds,
} from '../../hooks/useSetSecondsToSentenceIds';
import TopicContentAudioMode from './TopicContentAudioMode';
import TopicContentVideoMode from './TopicContentVideoMode';
import {TopicContentVideoProvider} from './context/TopicContentVideoProvider';
import {TopicContentAudioProvider} from './context/TopicContentAudioProvider';
import Sound from 'react-native-sound';
import useMP3File from '../../hooks/useMP3File';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';
import useOpenGoogleTranslate from '../../hooks/useOpenGoogleTranslate';

const useInitAudio = ({soundRef, topicName, url}) => {
  const {loadFile, filePath} = useMP3File(topicName);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(topicName, url);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  return {isLoaded};
};

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
  const [isVideoModeState, setIsVideoModeState] = useState(false);

  const [highlightTargetTextState, setHighlightTargetTextState] = useState('');
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);

  const {languageSelectedState} = useLanguageSelector();

  const soundRef = useRef<Sound>(null);

  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const {isLoaded} = useInitAudio({soundRef, topicName, url});

  const content = loadedContent.content;
  const origin = loadedContent.origin;
  const realStartTime = loadedContent?.realStartTime;
  const hasAudio = loadedContent?.hasAudio;
  const isDurationAudioLoaded = loadedContent?.isDurationAudioLoaded;

  const hasContentToReview = content?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  const isMediaContent = origin === 'netflix' || origin === 'youtube';

  const soundDuration = soundRef?.current?._duration || 0;

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogle = topicSentenceTargetLang => {
    openGoogleTranslateApp(topicSentenceTargetLang);
  };

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

  //check
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
          highlightTargetTextState={highlightTargetTextState}
          secondsToSentencesMapState={secondsToSentencesMapState}
          hasContentToReview={hasContentToReview}
          handleOpenGoogle={handleOpenGoogle}
        />
      </TopicContentVideoProvider>
    );
  }

  return (
    <TopicContentAudioProvider
      topicName={topicName}
      isVideoModeState={isVideoModeState}
      soundRef={soundRef}>
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
      />
    </TopicContentAudioProvider>
  );
};

export default TopicContent;
