import {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import {getFirebaseSongURL} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank, {
  makeArrayUnique,
} from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import useMasterAudioLoad from '../hooks/useMasterAudioLoad';
import SnippetTimeline from './SnippetTimeline';
import SnippetContainer from './SnippetContainer';
import DisplaySettings from './DisplaySettings';
import ConditionalWrapper from '../utils/conditional-wrapper';
import SatoriLine from './SatoriLine';
import TopicWordList from './TopicWordList';

const MusicContent = ({
  topicName,
  pureWordsUnique,
  japaneseLoadedWords,
  addSnippet,
  removeSnippet,
  snippetsForSelectedTopic,
  saveWordFirebase,
  topicData,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [progress, setProgress] = useState(0);
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
  const soundDuration = soundRef.current?._duration;

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

  const onLongPress = text => {
    const longPressedText = japaneseLoadedWords.find(
      word => word.surfaceForm === text,
    );
    if (longPressedText) {
      setLongPressedWord(longPressedText);
    }
  };

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

  const getThisTopicsWords = () => {
    const masterBank = makeArrayUnique([...(pureWordsUnique || [])]);
    if (masterBank?.length === 0) return [];
    const targetLangItems = topicData.map(item => item.targetLang);

    const pattern = new RegExp(`(${masterBank.join('|')})`, 'g');

    const segments = [] as any;
    targetLangItems.forEach(sentence => {
      sentence.split(pattern).forEach(segment => {
        if (segment.match(pattern)) {
          const thisWordData = japaneseLoadedWords.find(
            word => word.baseForm === segment || word.surfaceForm === segment,
          );
          segments.push(thisWordData);
        }
      });
    });

    return segments;
  };

  useEffect(() => {
    setThisTopicsWords(getThisTopicsWords());
  }, []);

  useEffect(() => {
    if (currentTimeState && !isFlowingSentences) {
      const currentAudioPlayingObj = topicData.find(
        item =>
          currentTimeState < (item.endAt || soundRef?.current?.duration) &&
          currentTimeState > item.startAt,
      );

      if (!currentAudioPlayingObj) {
        return;
      }
      const currentAudioPlayingIndex = currentAudioPlayingObj?.position;

      const newLine = topicData[currentAudioPlayingIndex];
      const newId = newLine.id;
      if (
        masterPlay !== undefined &&
        newId !== undefined &&
        newId !== masterPlay
      ) {
        soundRef.current.pause();
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(currentAudioPlayingObj.endAt);
        });
        setIsPlaying(false);
      }
    }
  }, [currentTimeState, topicData, masterPlay, isFlowingSentences, soundRef]);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        const lastItem = topicData[topicData.length - 1];
        if (lastItem) {
          setProgress(currentTime / soundDuration);
          setCurrentTimeState(currentTime);
        }
        const currentAudioPlaying = topicData.findIndex(
          item =>
            currentTime < (item.endAt || soundDuration) &&
            currentTime > item.startAt,
        );

        const newId = topicData[currentAudioPlaying]?.id;
        if (newId !== masterPlay) {
          setMasterPlay(newId);
        }
      });
    };
    const interval = setInterval(() => {
      if (
        soundRef.current &&
        topicData?.length > 0 &&
        soundRef.current?.isPlaying()
      ) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [masterPlay, topicData, soundRef, soundDuration, setMasterPlay]);

  const playFromThisSentence = id => {
    if (soundRef.current) {
      const thisItem = topicData.find(item => item.id === id);
      if (thisItem) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(thisItem.startAt);
        });
        soundRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  const generateRandomId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36); // Generate a version 4 (random) UUID
  };

  const deleteSnippet = idToBeDeleted => {
    const newSnippets = miniSnippets.filter(
      snippet => snippet.id !== idToBeDeleted,
    );
    setMiniSnippets(newSnippets);
  };

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

  const getLongPressedWordData = () => {
    const surfaceForm = longPressedWord.surfaceForm;
    const baseForm = longPressedWord.baseForm;
    const phonetic = longPressedWord.phonetic;
    const definition = longPressedWord.definition;

    return (
      surfaceForm + '...' + baseForm + '...' + phonetic + '...' + definition
    );
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
                if (topicSentence.targetLang === '') return null;
                const id = topicSentence.id;
                const focusThisSentence = id === masterPlay;

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
          progress={progress}
          time={currentTimeState.toFixed(2)}
        />
      </View>
      {snippetsLocalAndDb?.length > 0 && (
        <SnippetTimeline
          snippetsLocalAndDb={snippetsLocalAndDb}
          lastItem={soundRef?.current._duration}
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
