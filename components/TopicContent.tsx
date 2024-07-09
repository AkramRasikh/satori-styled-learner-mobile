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
import ConditionalWrapper from '../utils/conditional-wrapper';
import SatoriLine from './SatoriLine';
import TopicWordList from './TopicWordList';
import {MiniSnippet} from './Snippet';
import useContentControls from '../hooks/useContentControls';
import {generateRandomId} from '../utils/generate-random-id';
import {getThisTopicsWords} from '../helper-functions/get-this-topics-words';
import useAudioTextSync from '../hooks/useAudioTextSync';

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
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
  const [longPressedWord, setLongPressedWord] = useState();
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [thisTopicsWords, setThisTopicsWords] = useState([]);
  const [openTopicWords, setOpenTopicWords] = useState(false);
  const [seperateLines, setSeparateLines] = useState(true);
  const [wordTest, setWordTest] = useState(false);
  const [englishOnly, setEnglishOnly] = useState(false);
  const [engMaster, setEngMaster] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const topicData = japaneseLoadedContent[topicName];
  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    mp3 => mp3.name === topicName,
  );

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

  useMasterAudioLoad({soundRef, url});

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

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
    // formatTextForTargetWords,
    playFromThisSentence,
    deleteSnippet,
    getLongPressedWordData,
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
  });

  useEffect(() => {
    setThisTopicsWords(
      getThisTopicsWords({
        pureWordsUnique,
        topicData,
        japaneseLoadedWords,
      }),
    );
  }, []);

  const orderedContent = topicData.map((item, index) => {
    return {
      ...item,
      position: index,
    };
  });

  const hasAlreadyBeenUnified = structuredUnifiedData[topicName];

  const durations = useGetCombinedAudioData({
    hasUnifiedMP3File,
    audioFiles: orderedContent,
    hasAlreadyBeenUnified,
  });

  const durationsLengths = durations.length;
  const topicDataLengths = topicData?.length;

  const lastItem = durations[durations?.length - 1];

  const isLoading = durationsLengths !== topicDataLengths;

  useEffect(() => {
    if (!hasAlreadyBeenUnified && durationsLengths === topicDataLengths) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: durations,
      }));
    }
  }, [
    structuredUnifiedData,
    durationsLengths,
    topicName,
    durations,
    topicData,
    hasAlreadyBeenUnified,
    setStructuredUnifiedData,
    topicDataLengths,
  ]);

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

  const getTimeStamp = () => {
    const id = topicName + '-' + generateRandomId();
    const thisItem = durations.find(item => item.id === masterPlay);
    const targetLang = thisItem.targetLang;
    const itemToSave = {
      id,
      sentenceId: masterPlay,
      pointInAudio: currentTimeState,
      url,
      targetLang,
      topicName,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
    pauseSound();
    setIsPlaying(false);
  };

  if (isLoading) {
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
      />
      {openTopicWords && thisTopicsWords?.length > 0 ? (
        <TopicWordList thisTopicsWords={thisTopicsWords} />
      ) : null}
      {longPressedWord ? (
        <View
          style={{
            marginBottom: 15,
            borderTopColor: 'gray',
            borderTopWidth: 2,
            padding: 5,
          }}>
          <Text>Long Pressed: {getLongPressedWordData()}</Text>
        </View>
      ) : null}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          maxHeight: height * 0.6,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Text style={{fontSize: 20}}>
              {topicData?.map((topicSentence, index) => {
                const id = topicSentence.id;
                const focusThisSentence = id === masterPlay;

                const thisSnippets = snippetsLocalAndDb?.filter(
                  item => id === item.sentenceId && item?.saved,
                );

                return (
                  <ConditionalWrapper
                    key={id}
                    condition={seperateLines}
                    wrapper={children => (
                      <View
                        style={{
                          width: width * 0.9,
                          marginBottom: 10,
                        }}>
                        {children}
                      </View>
                    )}>
                    <Text
                      style={{
                        backgroundColor: focusThisSentence
                          ? 'yellow'
                          : 'transparent',
                        fontSize: 20,
                      }}>
                      <SatoriLine
                        id={id}
                        sentenceIndex={index}
                        focusThisSentence={focusThisSentence}
                        getSafeText={getSafeText}
                        topicSentence={topicSentence}
                        playFromThisSentence={playFromThisSentence}
                        wordTest={wordTest}
                        englishOnly={englishOnly}
                        highlightMode={highlightMode}
                        highlightedIndices={highlightedIndices}
                        setHighlightedIndices={setHighlightedIndices}
                        saveWordFirebase={saveWordFirebase}
                        engMaster={engMaster}
                        isPlaying={isPlaying}
                        pauseSound={pauseSound}
                      />
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                      }}>
                      {thisSnippets?.map((item, indexB) => {
                        return (
                          <MiniSnippet
                            index={indexB}
                            snippet={item}
                            setMasterAudio={setIsPlaying}
                            masterAudio={isPlaying}
                            soundRef={soundRef}
                          />
                        );
                      })}
                    </View>
                  </ConditionalWrapper>
                );
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
      {hasUnifiedMP3File && (
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
          <ProgressBarComponent
            progress={currentTimeState / soundDuration}
            time={currentTimeState.toFixed(2)}
          />
        </View>
      )}
      {lastItem && snippetsLocalAndDb?.length > 0 && (
        <SnippetTimeline
          snippetsLocalAndDb={snippetsLocalAndDb}
          lastItem={lastItem}
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
