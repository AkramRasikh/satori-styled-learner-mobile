import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../../hooks/useGetCombinedAudioData';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import useContentControls from '../../hooks/useContentControls';
import useInitTopicWordList from '../../hooks/useInitTopicWordList';
import useFormatUnderlyingWords from '../../hooks/useFormatUnderlyingWords';
import TopicContentLoader from '../TopicContentLoader';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import useSetSecondsToSentenceIds, {
  mapSentenceIdsToSeconds,
} from '../../hooks/useSetSecondsToSentenceIds';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import useTopicContentAudio from './context/useTopicContentAudio';
import TopicContentAudioMode from './TopicContentAudioMode';
import TopicContentVideoMode from './TopicContentVideoMode';
import {TopicContentVideoProvider} from './context/TopicContentVideoProvider';

const TopicContent = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
  loadedContent,
  targetSentenceId,
  breakdownSentenceFunc,
  handleIsCore,
  formattedData,
  setFormattedData,
  handleBulkReviews,
  updateContentMetaDataIsLoadedDispatch,
}) => {
  const [secondsToSentencesMapState, setSecondsToSentencesMapState] = useState<
    string[]
  >([]);
  const [initTargetLanguageWordsList, setInitTargetLanguageWordsList] =
    useState(null);
  const [highlightTargetTextState, setHighlightTargetTextState] = useState('');
  const [updateWordList, setUpdateWordList] = useState(false);
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);

  const {languageSelectedState} = useLanguageSelector();
  const targetLanguageLoadedWords = useSelector(state => state.words);

  const {pureWords: pureWordsUnique} = useData();

  const {isLoaded, soundRef, isVideoModeState, setIsVideoModeState} =
    useTopicContentAudio();

  const hasContentToReview = formattedData?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  const {content, origin, realStartTime, hasAudio, isDurationAudioLoaded} =
    loadedContent;

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

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique,
  });

  useEffect(() => {
    if (targetSentenceId && !(!isLoaded || formattedData?.length === 0)) {
      setHighlightTargetTextState(targetSentenceId);
    }
  }, [targetSentenceId, isLoaded, formattedData]);

  useEffect(() => {
    if (targetLanguageLoadedWords?.length !== initTargetLanguageWordsList) {
      setUpdateWordList(true);
      setInitTargetLanguageWordsList(targetLanguageLoadedWords.length);
    }
  }, [targetLanguageLoadedWords, initTargetLanguageWordsList]);

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return <TextSegment textSegments={textSegments} />;
  };

  useGetCombinedAudioData({
    hasAudio,
    content,
    setAudioLoadingProgress,
    isMediaContent,
    soundDuration,
    updateContentMetaDataIsLoadedDispatch,
    isDurationAudioLoaded,
  });

  const {formatTextForTargetWords} = useContentControls({
    targetLanguageLoadedWords,
    getSafeText,
    topicData: content,
  });

  useInitTopicWordList({
    targetLanguageLoadedWords,
    setInitTargetLanguageWordsList,
  });

  useFormatUnderlyingWords({
    setFormattedData,
    formatTextForTargetWords,
    formattedData,
    content,
    setUpdateWordList,
    updateWordList,
  });

  useSetSecondsToSentenceIds({
    content,
    soundDuration,
    secondsToSentencesMapState,
    setSecondsToSentencesMapState,
    isVideoModeState,
    realStartTime,
  });

  useEffect(() => {
    if (triggerSentenceIdUpdate) {
      const updatedFormattedData = formattedData.map((item, sentenceIndex) => {
        if (triggerSentenceIdUpdate !== item.id) {
          return item;
        }
        return {
          ...item,
          ...content[sentenceIndex],
        };
      });
      setFormattedData(updatedFormattedData);
      setTriggerSentenceIdUpdate(null);
    }
  }, [
    topicName,
    triggerSentenceIdUpdate,
    formattedData,
    content,
    setTriggerSentenceIdUpdate,
  ]);

  if (!isLoaded || formattedData?.length === 0) {
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
          formattedData={formattedData}
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
      formattedData={formattedData}
      hasContentToReview={hasContentToReview}
      url={url}
    />
  );
};

export default TopicContent;
