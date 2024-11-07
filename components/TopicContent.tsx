import React, {useEffect, useMemo, useRef, useState} from 'react';
import Sound from 'react-native-sound';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
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
import mapSentenceIdsToSeconds from '../helper-functions/map-sentence-ids-to-seconds';
import useTrackCurrentTimeState from '../hooks/useTrackCurrentTimeState';
import useOneByOneSentenceFlow from '../hooks/useOneByOneSentenceFlow';
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

  const {languageSelectedState} = useLanguageSelector();

  const {reviewHistory, content, nextReview} = loadedContent;

  const isCore = loadedContent?.isCore;
  const isMediaContent = loadedContent?.isMedia;

  const hasUnifiedMP3File = loadedContent.hasAudio;

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName]?.content;
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      loadedSnippets?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [loadedSnippets, miniSnippets]);

  const soundRef = useRef<Sound>(null);
  const audioControlsRef = useRef(null);

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

  useEffect(() => {
    if (
      soundDuration &&
      durationsLengths === topicDataLengths &&
      secondsToSentencesMapState?.length === 0
    ) {
      const mappedIds = mapSentenceIdsToSeconds({
        contentArr: durations,
        duration: soundDuration,
      }) as string[];
      setSecondsToSentencesMapState(mappedIds);
    }
  }, [
    soundDuration,
    durationsLengths,
    secondsToSentencesMapState,
    topicDataLengths,
    content,
    durations,
  ]);

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
          playFromThisSentence={playFromThisSentence}
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
      <ReviewSection
        topicName={topicName}
        reviewHistory={reviewHistory}
        nextReview={nextReview}
        updateTopicMetaData={updateTopicMetaData}
      />
    </View>
  );
};

export default TopicContent;
