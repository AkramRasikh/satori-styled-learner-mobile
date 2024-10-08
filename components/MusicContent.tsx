import {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import {getFirebaseSongURL} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import useMasterAudioLoad from '../hooks/useMasterAudioLoad';
import SnippetTimeline from './SnippetTimeline';
import SnippetContainer from './SnippetContainer';
import DisplaySettings from './DisplaySettings';
import TopicWordList from './TopicWordList';
import {getThisTopicsWords} from '../helper-functions/get-this-topics-words';
import useAudioTextSync from '../hooks/useAudioTextSync';
import useContentControls from '../hooks/useContentControls';
import LongPressedWord from './LongPressedWord';
import LineContainer from './LineContainer';
import WordStudySection from './WordStudySection';

const MusicContent = ({
  topicName,
  pureWordsUnique,
  japaneseLoadedWords,
  addSnippet,
  removeSnippet,
  snippetsForSelectedTopic,
  saveWordFirebase,
  topicData,
  setStructuredUnifiedData,
  structuredUnifiedData,
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
  const [wordTest, setWordTest] = useState(false);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
  const [initJapaneseWordsList, setInitJapaneseWordsList] = useState(null);
  const [updateWordList, setUpdateWordList] = useState(false);
  const [showWordStudyList, setShowWordStudyList] = useState(true);

  const isAlreadyLoaded = structuredUnifiedData[topicName];
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      snippetsForSelectedTopic?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [snippetsForSelectedTopic, miniSnippets]);

  const soundRef = useRef(null);
  const audioControlsRef = useRef(null);

  const {height, width} = Dimensions?.get('window');
  const url = getFirebaseSongURL(topicName);

  const soundRefLoaded = soundRef?.current?.isLoaded();
  const soundDuration = soundRef.current?._duration || 0;

  useMasterAudioLoad({soundRef, url});

  useEffect(() => {
    if (japaneseLoadedWords?.length !== initJapaneseWordsList) {
      setUpdateWordList(true);
      setInitJapaneseWordsList(japaneseLoadedWords.length);
    }
  }, [japaneseLoadedWords, initJapaneseWordsList]);

  useEffect(() => {
    if (!isAlreadyLoaded && formattedData?.length > 0) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: formattedData,
      }));
    }
  }, [setStructuredUnifiedData, isAlreadyLoaded, topicName, formattedData]);

  useAudioTextSync({
    currentTimeState,
    isFlowingSentences,
    soundRef,
    setIsPlaying,
    topicData,
    isPlaying,
    soundDuration,
    masterPlay,
    setCurrentTimeState,
    setMasterPlay,
  });

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  useEffect(() => {
    setThisTopicsWords(
      getThisTopicsWords({
        pureWordsUnique,
        topicData,
        japaneseLoadedWords,
      }),
    );
    setInitJapaneseWordsList(japaneseLoadedWords?.length);
  }, []);

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique,
  });

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
    topicData,
    miniSnippets,
    topicName,
    masterPlay,
    currentTimeState,
    url,
    pauseSound,
    setCurrentTimeState,
  });

  useEffect(() => {
    if (!isAlreadyLoaded) {
      setFormattedData(formatTextForTargetWords());
    } else if (isAlreadyLoaded && formattedData?.length === 0) {
      setFormattedData(isAlreadyLoaded);
    } else if (formattedData?.length > 0 && updateWordList) {
      setFormattedData(formatTextForTargetWords());
      setUpdateWordList(false);
    }
  }, [
    isAlreadyLoaded,
    formattedData,
    formatTextForTargetWords,
    setFormattedData,
    updateWordList,
  ]);

  if (!soundRefLoaded) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Loading</Text>
      </View>
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
        setEngMaster={setEngMaster}
        engMaster={engMaster}
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
        />
      </ScrollView>
      <View ref={audioControlsRef}>
        <SoundComponent
          soundRef={soundRef}
          isPlaying={isPlaying}
          playSound={playSound}
          pauseSound={pauseSound}
          rewindSound={rewindSound}
          forwardSound={forwardSound}
          getTimeStamp={getTimeStamp}
        />
        {soundDuration && currentTimeState ? (
          <ProgressBarComponent
            progress={currentTimeState / soundDuration}
            time={currentTimeState.toFixed(2)}
            endTime={soundDuration}
          />
        ) : null}
      </View>
      {snippetsLocalAndDb?.length > 0 && (
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

export default MusicContent;
