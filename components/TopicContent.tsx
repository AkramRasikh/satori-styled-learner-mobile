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
import useLanguageSelector from '../context/Data/useLanguageSelector';
import AudioToggles from './AudioToggles';
import {VideoRef} from 'react-native-video';
import VideoPlayer from './VideoPlayer';
import useTrackCurrentTimeState from '../hooks/useTrackCurrentTimeState';
import useOneByOneSentenceFlow from '../hooks/useOneByOneSentenceFlow';
import useVideoTextSync from '../hooks/useVideoTextSync';
import useSetSecondsToSentenceIds from '../hooks/useSetSecondsToSentenceIds';
import TopicContentAudioSection from './TopicContentAudioSection';

const TopicContent = ({
  topicName,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  targetLanguageLoadedWords,
  addSnippet,
  removeSnippet,
  saveWordFirebase,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
  loadedContent,
  loadedSnippets,
  setSelectedSnippetsState,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
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
  const [updateWordList, setUpdateWordList] = useState(false);
  const [showAdhocSentence, setShowAdhocSentence] = useState(false);
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentVideoTimeState, setCurrentVideoTimeState] = useState(0);
  const [videoDurationState, setVideoDurationState] = useState(0);

  const {languageSelectedState} = useLanguageSelector();

  const {reviewHistory, content, nextReview} = loadedContent;

  const isCore = loadedContent?.isCore;
  const isMediaContent = loadedContent?.isMedia;
  const hasVideo = loadedContent?.hasVideo;
  const realStartTime = loadedContent?.realStartTime;

  const hasUnifiedMP3File = loadedContent.hasAudio;

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName]?.content;
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      loadedSnippets?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [loadedSnippets, miniSnippets]);

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

  const handlePlaySound = () => {
    if (!isFlowingSentences) {
      setIsFlowingSentences(true);
    }
    playSound();
  };

  const handleVideoMode = () => {};

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

  const handleAddAdhocSentence = () => {
    setShowAdhocSentence(true);
    pauseSound();
  };

  const orderedContent = content?.map((item, index) => {
    return {
      ...item,
      position: index,
    };
  });

  const durations = useGetCombinedAudioData({
    hasUnifiedMP3File,
    audioFiles: orderedContent,
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

  const durationsLengths = durations.length;
  const topicDataLengths = content?.length;

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
    topicData: durations,
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
    durations,
    setUpdateWordList,
    updateWordList,
  });

  useSetTopicAudioDataInState({
    structuredUnifiedData,
    durationsLengths,
    topicName,
    durations,
    topicData: content,
    hasAlreadyBeenUnified,
    setStructuredUnifiedData,
    topicDataLengths,
  });

  useTrackCurrentTimeState({
    soundRef,
    setCurrentTimeState,
  });

  useOneByOneSentenceFlow({
    currentTimeState,
    isFlowingSentences,
    soundRef,
    setIsPlaying,
    durations,
    masterPlay,
  });

  useAudioTextSync({
    currentTimeState,
    setMasterPlay,
    secondsToSentencesMapState,
  });

  useSetSecondsToSentenceIds({
    durations,
    soundDuration,
    secondsToSentencesMapState,
    setSecondsToSentencesMapState,
    isVideoModeState,
    realStartTime,
  });

  useEffect(() => {
    if (triggerSentenceIdUpdate) {
      const idForTriggeredSentence = triggerSentenceIdUpdate.id;
      const fieldToUpdateForTriggeredSentence =
        triggerSentenceIdUpdate.fieldToUpdate;

      const updatedFormattedData = formattedData.map(item => {
        if (idForTriggeredSentence !== item.id) {
          return item;
        }
        return {
          ...item,
          ...fieldToUpdateForTriggeredSentence,
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
    durations,
    triggerSentenceIdUpdate,
    formattedData,
    content,
    setTriggerSentenceIdUpdate,
  ]);

  const handlePlayFromThisSentence = playFromHere => {
    if (isVideoModeState) {
      jumpToAudioPoint(realStartTime + playFromHere);
    } else {
      playFromThisSentence(playFromHere);
    }
  };

  const videoUrl = hasVideo
    ? getFirebaseVideoURL('meiji-era-intro', 'japanese')
    : '';

  if (!isLoaded || formattedData?.length === 0) {
    return (
      <TopicContentLoader
        audioLoadingProgress={audioLoadingProgress}
        topicDataLengths={topicDataLengths}
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
            isFlowingSentences={isFlowingSentences}
            setIsFlowingSentences={setIsFlowingSentences}
            engMaster={engMaster}
            setEngMaster={setEngMaster}
            handleIsCore={handleIsCore}
            isCore={isCore}
            handleAddAdhocSentence={handleAddAdhocSentence}
            isVideoModeState={isVideoModeState}
            setIsVideoModeState={setIsVideoModeState}
            hasVideo={hasVideo}
          />
          {longPressedWord?.length ? (
            <LongPressedWord getLongPressedWordData={getLongPressedWordData} />
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
              realStartTime={realStartTime}
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
        isFlowingSentences={isFlowingSentences}
        setIsFlowingSentences={setIsFlowingSentences}
        engMaster={engMaster}
        setEngMaster={setEngMaster}
        handleIsCore={handleIsCore}
        isCore={isCore}
        handleAddAdhocSentence={handleAddAdhocSentence}
        isVideoModeState={isVideoModeState}
        setIsVideoModeState={setIsVideoModeState}
        hasVideo={hasVideo}
      />
      {longPressedWord?.length ? (
        <LongPressedWord getLongPressedWordData={getLongPressedWordData} />
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
          playSound={handlePlaySound}
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
