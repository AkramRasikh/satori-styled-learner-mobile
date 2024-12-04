import React, {useEffect, useMemo, useRef, useState} from 'react';
import Sound from 'react-native-sound';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
  getFirebaseVideoURL,
} from '../hooks/useGetCombinedAudioData';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import DisplaySettings from './DisplaySettings';
import useContentControls from '../hooks/useContentControls';
import useAudioTextSync from '../hooks/useAudioTextSync';
import LineContainer from './LineContainer';
import LongPressedWord from './LongPressedWord';
import useInitTopicWordList from '../hooks/useInitTopicWordList';
import useFormatUnderlyingWords from '../hooks/useFormatUnderlyingWords';
import TopicContentLoader from './TopicContentLoader';
import useSetTopicAudioDataInState from '../hooks/useSetTopicAudioDataInState';
import ReviewSection from './ReviewSection';
import useMP3File from '../hooks/useMP3File';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import AdhocSentenceContainer from './AdhocSentenceContainer';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import AudioToggles from './AudioToggles';
import {VideoRef} from 'react-native-video';
import VideoPlayer from './VideoPlayer';
import useTrackCurrentTimeState from '../hooks/useTrackCurrentTimeState';
import useVideoTextSync from '../hooks/useVideoTextSync';
import useSetSecondsToSentenceIds, {
  mapSentenceIdsToSeconds,
} from '../hooks/useSetSecondsToSentenceIds';
import TopicContentAudioSection from './TopicContentAudioSection';
import useData from '../context/Data/useData';
import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';

const TopicContent = ({
  topicName,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
  loadedContent,
  targetSentenceId,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [longPressedWord, setLongPressedWord] = useState([]);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [isVideoModeState, setIsVideoModeState] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [secondsToSentencesMapState, setSecondsToSentencesMapState] = useState<
    string[]
  >([]);
  const [initTargetLanguageWordsList, setInitTargetLanguageWordsList] =
    useState(null);
  const [highlightTargetTextState, setHighlightTargetTextState] = useState('');
  const [updateWordList, setUpdateWordList] = useState(false);
  const [showAdhocSentence, setShowAdhocSentence] = useState(false);
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoTimeState, setCurrentVideoTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);
  const [selectedSnippetsState, setSelectedSnippetsState] = useState([]);

  const {languageSelectedState} = useLanguageSelector();
  const {
    structuredUnifiedData,
    setStructuredUnifiedData,
    pureWords: pureWordsUnique,
    saveWordFirebase,
    addSnippet,
    targetLanguageWordsState: targetLanguageLoadedWords,
    removeSnippet,
    targetLanguageSnippetsState,
    sentenceReviewBulk,
  } = useData();

  const hasContentToReview = formattedData?.some(
    sentenceWidget => sentenceWidget?.reviewData,
  );

  useEffect(() => {
    setSelectedSnippetsState(
      targetLanguageSnippetsState?.filter(item => item.topicName === topicName),
    );
  }, []);

  const {reviewHistory, content, nextReview} = loadedContent;

  const isCore = loadedContent?.isCore;
  const contentIndex = loadedContent?.contentIndex;
  const isMediaContent =
    loadedContent?.origin === 'netflix' || loadedContent?.origin === 'youtube';
  const hasVideo = loadedContent?.hasVideo;
  const realStartTime = loadedContent?.realStartTime;

  const hasUnifiedMP3File = loadedContent.hasAudio;

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName]?.content;
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      selectedSnippetsState?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [selectedSnippetsState, miniSnippets]);

  const soundRef = useRef<Sound>(null);
  const videoRef = useRef<VideoRef>(null);

  const jumpAudioValue = 2;

  const progress =
    currentVideoTimeState && videoDurationState
      ? currentVideoTimeState / videoDurationState
      : 0;

  const videoInstance = videoRef?.current;

  const jumpToAudioPoint = (videoPosition: number) => {
    if (!videoInstance) {
      return null;
    }
    videoInstance.seek(videoPosition);
  };

  const seekHandler = (isForward: boolean) => {
    if (!videoInstance) {
      return null;
    }
    if (isForward) {
      videoInstance.seek(currentVideoTimeState + jumpAudioValue);
    } else {
      videoInstance.seek(currentVideoTimeState - jumpAudioValue);
    }
  };

  const playVideo = () => {
    if (isVideoPlaying) {
      setIsVideoPlaying(false);
    } else {
      setIsVideoPlaying(true);
    }
  };

  const {height, width} = Dimensions?.get('window');
  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const soundDuration = soundRef?.current?._duration || 0;

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

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  const handleVideoMode = (switchToVideoMode: boolean) => {
    if (switchToVideoMode) {
      setIsVideoModeState(true);
      setSecondsToSentencesMapState(
        mapSentenceIdsToSeconds({
          contentWithTimeStamps,
          duration: soundDuration,
          isVideoModeState: true,
          realStartTime,
        }),
      );
    } else {
      setIsVideoModeState(false);
      setSecondsToSentencesMapState(
        mapSentenceIdsToSeconds({
          contentWithTimeStamps,
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

  const handleIsCore = () => {
    const fieldToUpdate = {
      isCore: !Boolean(isCore),
    };

    updateTopicMetaData({
      topicName,
      fieldToUpdate,
    });
  };

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
    return textSegments.map((segment, index) => {
      return (
        <Text
          key={index}
          id={segment.id}
          style={[segment.style]}
          onLongPress={() => onLongPress(segment.text)}>
          {segment.text}
        </Text>
      );
    });
  };

  const handleBulkReviews = async () => {
    const emptyCard = getEmptyCard();

    const nextScheduledOptions = getNextScheduledOptions({
      card: emptyCard,
      contentType: srsRetentionKeyTypes.sentences,
    });
    const nextDueCard = nextScheduledOptions['2'].card;
    const updatedContent = await sentenceReviewBulk({
      topicName,
      fieldToUpdate: {
        reviewData: nextDueCard,
      },
      contentIndex,
    });

    if (updatedContent) {
      const updatedFormattedData = formattedData.map(item => {
        return {
          ...item,
          reviewData: nextDueCard,
        };
      });
      setFormattedData(updatedFormattedData);
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: {content: updatedFormattedData},
      }));
    }
  };

  const handleAddAdhocSentence = () => {
    setShowAdhocSentence(true);
    pauseSound();
  };

  const contentWithTimeStamps = useGetCombinedAudioData({
    hasUnifiedMP3File,
    audioFiles: content,
    hasAlreadyBeenUnified,
    setAudioLoadingProgress,
    isMediaContent,
    soundDuration,
  });

  const playFromHere = seconds => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(() => {
        soundRef.current.setCurrentTime(seconds);
      });
      setCurrentTimeState(seconds);
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRemoveWords = () => {
    setLongPressedWord([]);
  };

  const handleAddSnippet = async snippetData => {
    try {
      const snippetResponse = await addSnippet(snippetData);
      setSelectedSnippetsState(prev => [
        ...prev,
        {...snippetResponse, saved: true},
      ]);
    } catch (error) {
      console.error('## failed to add snippet state');
    }
  };

  const {
    onLongPress,
    formatTextForTargetWords,
    playFromThisSentence,
    deleteSnippet,
    getLongPressedWordData,
    getTimeStamp,
  } = useContentControls({
    targetLanguageLoadedWords,
    setLongPressedWord,
    soundRef,
    setIsPlaying,
    setMiniSnippets,
    longPressedWord,
    getSafeText,
    topicData: contentWithTimeStamps,
    miniSnippets,
    topicName,
    masterPlay,
    currentTimeState,
    url,
    pauseSound,
    isText: true,
    setCurrentTimeState,
    setSelectedSnippetsState,
    removeSnippet,
  });

  useVideoTextSync({
    currentVideoTimeState,
    setMasterPlay,
    secondsToSentencesMapState,
  });

  useInitTopicWordList({
    targetLanguageLoadedWords,
    setInitTargetLanguageWordsList,
  });

  useFormatUnderlyingWords({
    setFormattedData,
    formatTextForTargetWords,
    formattedData,
    contentWithTimeStamps,
    setUpdateWordList,
    updateWordList,
  });

  useSetTopicAudioDataInState({
    structuredUnifiedData,
    topicName,
    contentWithTimeStamps,
    topicData: content,
    hasAlreadyBeenUnified,
    setStructuredUnifiedData,
  });

  useTrackCurrentTimeState({
    soundRef,
    setCurrentTimeState,
  });

  useAudioTextSync({
    currentTimeState,
    setMasterPlay,
    secondsToSentencesMapState,
  });

  useSetSecondsToSentenceIds({
    contentWithTimeStamps,
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
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: {content: updatedFormattedData},
      }));
    }
  }, [
    topicName,
    setStructuredUnifiedData,
    triggerSentenceIdUpdate,
    formattedData,
    content,
    setTriggerSentenceIdUpdate,
  ]);

  const handlePlayFromThisSentence = playFromHere => {
    if (isVideoModeState) {
      jumpToAudioPoint(realStartTime + playFromHere);
      if (!isVideoPlaying) {
        playVideo();
      }
    } else {
      playFromThisSentence(playFromHere);
    }
  };

  const videoUrl = hasVideo
    ? getFirebaseVideoURL(getGeneralTopicName(topicName), languageSelectedState)
    : '';

  if (!isLoaded || formattedData?.length === 0) {
    return (
      <TopicContentLoader
        audioLoadingProgress={audioLoadingProgress}
        topicDataLengths={content.length}
      />
    );
  }

  if (showAdhocSentence) {
    return (
      <AdhocSentenceContainer
        topicName={topicName}
        setShowAdhocSentence={setShowAdhocSentence}
      />
    );
  }

  if (isVideoModeState) {
    return (
      <View>
        <View>
          <DisplaySettings
            englishOnly={englishOnly}
            setEnglishOnly={setEnglishOnly}
            engMaster={engMaster}
            setEngMaster={setEngMaster}
            handleIsCore={handleIsCore}
            isCore={isCore}
            handleAddAdhocSentence={handleAddAdhocSentence}
            isVideoModeState={isVideoModeState}
            hasVideo={hasVideo}
            handleVideoMode={handleVideoMode}
            handleBulkReviews={handleBulkReviews}
            hasContentToReview={hasContentToReview}
          />
          {longPressedWord?.length ? (
            <LongPressedWord
              getLongPressedWordData={getLongPressedWordData}
              handleRemoveWords={handleRemoveWords}
            />
          ) : null}
          {hasUnifiedMP3File && (
            <VideoPlayer
              url={videoUrl}
              videoRef={videoRef}
              isPlaying={isVideoPlaying}
              onProgressHandler={setCurrentVideoTimeState}
              setVideoDuration={setVideoDurationState}
            />
          )}
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{
              maxHeight: height * 0.45,
            }}>
            <LineContainer
              formattedData={formattedData}
              playFromThisSentence={handlePlayFromThisSentence}
              englishOnly={englishOnly}
              highlightedIndices={highlightedIndices}
              setHighlightedIndices={setHighlightedIndices}
              saveWordFirebase={saveWordFirebase}
              engMaster={engMaster}
              isPlaying={isVideoPlaying}
              pauseSound={pauseSound}
              width={width}
              snippetsLocalAndDb={snippetsLocalAndDb}
              masterPlay={masterPlay}
              highlightMode={highlightMode}
              setHighlightMode={setHighlightMode}
              onLongPress={onLongPress}
              topicName={topicName}
              updateSentenceData={updateSentenceData}
              currentTimeState={currentTimeState}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              deleteSnippet={deleteSnippet}
              playSound={playFromHere}
              setMiniSnippets={setMiniSnippets}
              handleAddSnippet={handleAddSnippet}
              highlightTargetTextState={highlightTargetTextState}
              contentIndex={contentIndex}
            />
          </ScrollView>
        </View>
        <View>
          <AudioToggles
            isPlaying={isVideoPlaying}
            playSound={playVideo}
            seekHandler={seekHandler}
            jumpAudioValue={jumpAudioValue}
            progress={progress}
          />
          <ReviewSection
            topicName={topicName}
            reviewHistory={reviewHistory}
            nextReview={nextReview}
            updateTopicMetaData={updateTopicMetaData}
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <DisplaySettings
        englishOnly={englishOnly}
        setEnglishOnly={setEnglishOnly}
        engMaster={engMaster}
        setEngMaster={setEngMaster}
        handleIsCore={handleIsCore}
        isCore={isCore}
        handleAddAdhocSentence={handleAddAdhocSentence}
        isVideoModeState={isVideoModeState}
        hasVideo={hasVideo}
        handleVideoMode={handleVideoMode}
        handleBulkReviews={handleBulkReviews}
        hasContentToReview={hasContentToReview}
      />
      {longPressedWord?.length ? (
        <LongPressedWord
          getLongPressedWordData={getLongPressedWordData}
          handleRemoveWords={handleRemoveWords}
        />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          maxHeight: height * 0.6,
        }}>
        <LineContainer
          formattedData={formattedData}
          playFromThisSentence={handlePlayFromThisSentence}
          // playFromThisSentence={playFromThisSentence}
          englishOnly={englishOnly}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
          saveWordFirebase={saveWordFirebase}
          engMaster={engMaster}
          isPlaying={isPlaying}
          pauseSound={pauseSound}
          width={width}
          snippetsLocalAndDb={snippetsLocalAndDb}
          masterPlay={masterPlay}
          highlightMode={highlightMode}
          setHighlightMode={setHighlightMode}
          onLongPress={onLongPress}
          topicName={topicName}
          updateSentenceData={updateSentenceData}
          currentTimeState={currentTimeState}
          addSnippet={addSnippet}
          removeSnippet={removeSnippet}
          deleteSnippet={deleteSnippet}
          playSound={playFromHere}
          setMiniSnippets={setMiniSnippets}
          handleAddSnippet={handleAddSnippet}
          highlightTargetTextState={highlightTargetTextState}
          contentIndex={contentIndex}
        />
      </ScrollView>
      <ReviewSection
        topicName={topicName}
        reviewHistory={reviewHistory}
        nextReview={nextReview}
        updateTopicMetaData={updateTopicMetaData}
      />
      {hasUnifiedMP3File && (
        <TopicContentAudioSection
          isPlaying={isPlaying}
          playSound={playSound}
          pauseSound={pauseSound}
          rewindSound={rewindSound}
          forwardSound={forwardSound}
          getTimeStamp={getTimeStamp}
          currentTimeState={currentTimeState}
          soundDuration={soundDuration}
        />
      )}
    </View>
  );
};

export default TopicContent;
