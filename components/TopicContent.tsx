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
import TopicWordList from './TopicWordList';
import useContentControls from '../hooks/useContentControls';
import {getThisTopicsWords} from '../helper-functions/get-this-topics-words';
import useAudioTextSync from '../hooks/useAudioTextSync';
import LineContainer from './LineContainer';
import WordStudySection from './WordStudySection';
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

const TopicContent = ({
  topicName,
  targetLanguageLoadedContent,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  targetLanguageLoadedWords,
  addSnippet,
  removeSnippet,
  snippetsForSelectedTopic,
  saveWordFirebase,
  wordsToStudy,
  updateTopicMetaData,
  updateSentenceData,
  triggerSentenceIdUpdate,
  setTriggerSentenceIdUpdate,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
  const [longPressedWord, setLongPressedWord] = useState([]);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [thisTopicsWords, setThisTopicsWords] = useState([]);
  const [openTopicWords, setOpenTopicWords] = useState(false);
  const [wordTest, setWordTest] = useState(false);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [initJapaneseWordsList, setInitJapaneseWordsList] = useState(null);
  const [updateWordList, setUpdateWordList] = useState(false);
  const [showWordStudyList, setShowWordStudyList] = useState(false);
  const [showAdhocSentence, setShowAdhocSentence] = useState(false);
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);

  const thisTopicLoadedContent = targetLanguageLoadedContent.find(
    contentData => contentData.title === topicName,
  );

  const topicData = thisTopicLoadedContent.content.filter(
    contentItem => contentItem !== null,
  );

  const reviewHistory = thisTopicLoadedContent.reviewHistory;
  const nextReview = thisTopicLoadedContent.nextReview;

  const isCore = thisTopicLoadedContent?.isCore;
  const isMediaContent =
    thisTopicLoadedContent?.origin === 'netflix' ||
    thisTopicLoadedContent?.origin === 'youtube';

  const hasUnifiedMP3File = thisTopicLoadedContent.hasAudio;

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName]?.content;
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      snippetsForSelectedTopic?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [snippetsForSelectedTopic, miniSnippets]);

  const soundRef = useRef(null);
  const audioControlsRef = useRef(null);

  const {height, width} = Dimensions?.get('window');
  const url = getFirebaseAudioURL(topicName);

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
    if (targetLanguageLoadedWords?.length !== initJapaneseWordsList) {
      setUpdateWordList(true);
      setInitJapaneseWordsList(targetLanguageLoadedWords.length);
    }
  }, [targetLanguageLoadedWords, initJapaneseWordsList]);

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

  const orderedContent = topicData.map((item, index) => {
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
  const topicDataLengths = topicData?.length;

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
    setThisTopicsWords,
    getThisTopicsWords,
    pureWordsUnique,
    topicData,
    targetLanguageLoadedWords,
    setInitJapaneseWordsList,
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
    topicData,
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
      // find sentenceId in content
      const shouldTriggerFormatDataUpdate = topicData.find(
        sentenceData => sentenceData.id === triggerSentenceIdUpdate,
      );
      if (shouldTriggerFormatDataUpdate) {
        const updatedFormattedData = formattedData.map(item => {
          if (triggerSentenceIdUpdate !== item.id) {
            return item;
          }
          return {
            ...item,
            ...shouldTriggerFormatDataUpdate,
          };
        });
        setFormattedData(updatedFormattedData);
        setTriggerSentenceIdUpdate('');
      }
    }
  }, [
    triggerSentenceIdUpdate,
    formattedData,
    topicData,
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
      {showWordStudyList && wordsToStudy ? (
        <WordStudySection wordsToStudy={wordsToStudy} />
      ) : null}
      <DisplaySettings
        wordTest={wordTest}
        setWordTest={setWordTest}
        englishOnly={englishOnly}
        setEnglishOnly={setEnglishOnly}
        highlightMode={highlightMode}
        setHighlightMode={setHighlightMode}
        setOpenTopicWords={setOpenTopicWords}
        openTopicWords={openTopicWords}
        isFlowingSentences={isFlowingSentences}
        setIsFlowingSentences={setIsFlowingSentences}
        engMaster={engMaster}
        setEngMaster={setEngMaster}
        showWordStudyList={showWordStudyList}
        setShowWordStudyList={setShowWordStudyList}
      />
      {openTopicWords && thisTopicsWords?.length > 0 ? (
        <TopicWordList thisTopicsWords={thisTopicsWords} />
      ) : null}
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
      {/* showAdhocSentence, setShowAdhocSentence */}
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
          url={url}
        />
      )}
    </View>
  );
};

export default TopicContent;
