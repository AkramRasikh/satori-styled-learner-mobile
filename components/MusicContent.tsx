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
import ConditionalWrapper from '../utils/conditional-wrapper';
import SatoriLine from './SatoriLine';
import TopicWordList from './TopicWordList';
import SafeTextComponent from './SafeTextComponent';
import {getThisTopicsWords} from '../helper-functions/get-this-topics-words';
import useAudioTextSync from '../hooks/useAudioTextSync';
import {generateRandomId} from '../utils/generate-random-id';
import useContentControls from '../hooks/useContentControls';
import LongPressedWord from './LongPressedWord';
import {MiniSnippet} from './Snippet';

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
  const [engMaster, setEngMaster] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [formattedData, setFormattedData] = useState([]);
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
  }, []);

  useEffect(() => {
    if (!isAlreadyLoaded) {
      setFormattedData(formatTextForTargetWords());
    } else if (isAlreadyLoaded && formattedData?.length === 0) {
      setFormattedData(isAlreadyLoaded);
    }
  }, [isAlreadyLoaded, formattedData, setFormattedData]);

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique,
  });

  const getSafeText = targetText => {
    return (
      <SafeTextComponent
        underlineWordsInSentence={underlineWordsInSentence}
        targetText={targetText}
        onLongPress={onLongPress}
      />
    );
  };

  const {
    onLongPress,
    formatTextForTargetWords,
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

  const getTimeStamp = () => {
    const id = topicName + '-' + generateRandomId();
    const thisItem = topicData.find(item => item.id === masterPlay);
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
        setEngMaster={setEngMaster}
        engMaster={engMaster}
      />
      {openTopicWords && thisTopicsWords?.length > 0 ? (
        <TopicWordList thisTopicsWords={thisTopicsWords} />
      ) : null}
      {longPressedWord ? (
        <LongPressedWord getLongPressedWordData={getLongPressedWordData} />
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
              {formattedData?.map((topicSentence, index) => {
                if (topicSentence.targetLang === '') return null;
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
                        preLoadedSafeText={topicSentence.safeText}
                        textWidth={width * 0.9}
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
                            key={indexB}
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
