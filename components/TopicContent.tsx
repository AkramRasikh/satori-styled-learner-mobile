import {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import useMasterAudioLoad from '../hooks/useMasterAudioLoad';
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

const TopicContent = ({
  topicName,
  japaneseLoadedContent,
  japaneseLoadedContentFullMP3s,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  japaneseLoadedWords,
  addSnippet,
  removeSnippet,
  snippetsForSelectedTopic,
  saveWordFirebase,
  wordsToStudy,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
  const [longPressedWord, setLongPressedWord] = useState([]);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [thisTopicsWords, setThisTopicsWords] = useState([]);
  const [openTopicWords, setOpenTopicWords] = useState(false);
  const [seperateLines, setSeparateLines] = useState(true);
  const [wordTest, setWordTest] = useState(false);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [initJapaneseWordsList, setInitJapaneseWordsList] = useState(null);
  const [updateWordList, setUpdateWordList] = useState(false);
  const [showWordStudyList, setShowWordStudyList] = useState(true);
  const [audioLoadingProgress, setAudioLoadingProgress] = useState(0);

  const thisTopicLoadedContent = japaneseLoadedContent.find(
    contentData => contentData.title === topicName,
  );
  const topicData = thisTopicLoadedContent.content;
  const reviewHistory = thisTopicLoadedContent.reviewHistory;
  const nextReview = thisTopicLoadedContent.nextReview;

  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    mp3 => mp3.name === topicName,
  );

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName]?.content;
  const hasAlreadyBeenUnifiedAudioInstance =
    structuredUnifiedData[topicName]?.audioInstance;

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

  const audioInstance = useMasterAudioLoad({
    soundRef,
    url,
    hasAlreadyBeenUnifiedAudioInstance,
  });

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
    if (japaneseLoadedWords?.length !== initJapaneseWordsList) {
      setUpdateWordList(true);
      setInitJapaneseWordsList(japaneseLoadedWords.length);
    }
  }, [japaneseLoadedWords, initJapaneseWordsList]);

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
    japaneseLoadedWords,
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
    japaneseLoadedWords,
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
    audioInstance,
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

  if (!soundRefLoaded || formattedData?.length === 0) {
    return (
      <TopicContentLoader
        audioLoadingProgress={audioLoadingProgress}
        topicDataLengths={topicDataLengths}
      />
    );
  }

  return (
    <View>
      {showWordStudyList && wordsToStudy ? (
        <WordStudySection wordsToStudy={wordsToStudy} />
      ) : null}
      <DisplaySettings
        seperateLines={seperateLines}
        setSeparateLines={setSeparateLines}
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
          seperateLines={seperateLines}
          soundRef={soundRef}
          snippetsLocalAndDb={snippetsLocalAndDb}
          masterPlay={masterPlay}
          highlightMode={highlightMode}
          setIsPlaying={setIsPlaying}
          setHighlightMode={setHighlightMode}
          onLongPress={onLongPress}
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
              endTime={soundDuration}
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
      />
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
