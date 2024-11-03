import {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import SnippetTimeline from './SnippetTimeline';
import SnippetContainer from './SnippetContainer';
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
import IsCoreSection from './IsCoreSection';
import useMP3File from '../hooks/useMP3File';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import AdhocSentenceContainer from './AdhocSentenceContainer';
import useLanguageSelector from '../context/Data/useLanguageSelector';

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
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
  const [longPressedWord, setLongPressedWord] = useState([]);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [wordTest, setWordTest] = useState(false);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
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

  const soundRef = useRef(null);
  const audioControlsRef = useRef(null);

  const {height, width} = Dimensions?.get('window');
  const url = getFirebaseAudioURL(topicName, languageSelectedState);

  const soundRefLoaded = soundRef?.current?.isLoaded();
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

  const durationsLengths = durations.length;
  const topicDataLengths = content?.length;

  const lastItem = durations[durations?.length - 1];

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

  useAudioTextSync({
    currentTimeState,
    isFlowingSentences,
    soundRef,
    setIsPlaying,
    topicData: durations,
    isPlaying,
    soundDuration,
    masterPlay,
    setCurrentTimeState,
    setMasterPlay,
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
        wordTest={wordTest}
        setWordTest={setWordTest}
        englishOnly={englishOnly}
        setEnglishOnly={setEnglishOnly}
        isFlowingSentences={isFlowingSentences}
        setIsFlowingSentences={setIsFlowingSentences}
        engMaster={engMaster}
        setEngMaster={setEngMaster}
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
          wordTest={wordTest}
          englishOnly={englishOnly}
          highlightedIndices={highlightedIndices}
          setHighlightedIndices={setHighlightedIndices}
          saveWordFirebase={saveWordFirebase}
          engMaster={engMaster}
          isPlaying={isPlaying}
          pauseSound={pauseSound}
          width={width}
          soundRef={soundRef}
          snippetsLocalAndDb={snippetsLocalAndDb}
          masterPlay={masterPlay}
          highlightMode={highlightMode}
          setIsPlaying={setIsPlaying}
          setHighlightMode={setHighlightMode}
          onLongPress={onLongPress}
          topicName={topicName}
          updateSentenceData={updateSentenceData}
        />
      </ScrollView>
      {hasUnifiedMP3File && (
        <View ref={audioControlsRef}>
          <SoundComponent
            soundRef={soundRef}
            isPlaying={isPlaying}
            playSound={handlePlaySound}
            pauseSound={pauseSound}
            rewindSound={rewindSound}
            forwardSound={forwardSound}
            getTimeStamp={getTimeStamp}
          />
          {soundDuration && currentTimeState ? (
            <ProgressBarComponent
              endTime={soundDuration.toFixed(2)}
              progress={currentTimeState / soundDuration}
              time={currentTimeState.toFixed(2)}
            />
          ) : null}
        </View>
      )}
      <ReviewSection
        topicName={topicName}
        reviewHistory={reviewHistory}
        nextReview={nextReview}
        updateTopicMetaData={updateTopicMetaData}
      />
      <IsCoreSection
        updateTopicMetaData={updateTopicMetaData}
        topicName={topicName}
        isCore={isCore}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginVertical: 10,
        }}>
        <TouchableOpacity onPress={handleAddAdhocSentence}>
          <Text>(+) Add Adhoc sentence</Text>
        </TouchableOpacity>
      </View>
      {lastItem && snippetsLocalAndDb?.length > 0 && (
        <SnippetTimeline
          snippetsLocalAndDb={snippetsLocalAndDb}
          duration={soundDuration}
        />
      )}

      {soundRefLoaded && snippetsLocalAndDb?.length > 0 && (
        <SnippetContainer
          snippetsLocalAndDb={snippetsLocalAndDb}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          deleteSnippet={deleteSnippet}
          addSnippet={addSnippet}
          removeSnippet={removeSnippet}
          soundRef={soundRef}
          url={url}
        />
      )}
    </View>
  );
};

export default TopicContent;
