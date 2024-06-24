import {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank, {
  makeArrayUnique,
} from '../hooks/useHighlightWordToWordBank';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import {SnippetContainer} from './Snippet';
import useMasterAudioLoad from '../hooks/useMasterAudioLoad';
import FlowSetting from './FlowSetting';
import SnippetTimeline from './SnippetTimeline';

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

  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      snippetsForSelectedTopic?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [snippetsForSelectedTopic, miniSnippets]);

  const soundRef = useRef(null);
  const audioControlsRef = useRef(null);

  const {height} = Dimensions?.get('window');
  const url = getFirebaseAudioURL(topicName);

  const soundRefLoaded = soundRef?.current?.isLoaded();

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
          style={[segment.style]}
          onLongPress={() => onLongPress(segment.text)}>
          {segment.text}
        </Text>
      );
    });
  };

  const topicData = japaneseLoadedContent[topicName];
  const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
    mp3 => mp3.name === topicName,
  );

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

  useEffect(() => {
    if (currentTimeState && !isFlowingSentences) {
      const currentAudioPlayingObj = durations.find(
        item =>
          currentTimeState < item.endAt && currentTimeState > item.startAt,
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
  }, [
    currentTimeState,
    topicData,
    durations,
    masterPlay,
    isFlowingSentences,
    soundRef,
  ]);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        const lastItem = durations[durations.length - 1];
        if (lastItem) {
          setProgress(currentTime / lastItem.endAt);
          setCurrentTimeState(currentTime);
        }
        const currentAudioPlaying = durations.findIndex(
          item => currentTime < item.endAt && currentTime > item.startAt,
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
        durations?.length > 0 &&
        soundRef.current?.isPlaying()
      ) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [durations, masterPlay, topicData, soundRef, setMasterPlay, isLoading]);

  const playFromThisSentence = id => {
    if (soundRef.current) {
      const thisItem = durations.find(item => item.id === id);
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

  const getThisTopicsWordsEach = word => {
    const surfaceForm = word.surfaceForm;
    const baseForm = word.baseForm;
    const phonetic = word.phonetic;
    const definition = word.definition;
    return surfaceForm + ', ' + baseForm + ', ' + phonetic + ', ' + definition;
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
      {openTopicWords ? (
        <View>
          {thisTopicsWords?.map((topicsWords, index) => {
            const listNumber = index + 1 + ') ';
            return (
              <View
                key={index}
                style={{
                  padding: 5,
                }}>
                <Text>
                  {listNumber}
                  {getThisTopicsWordsEach(topicsWords)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
      {thisTopicsWords?.length > 0 ? (
        <View
          style={{
            margin: 'auto',
            padding: 10,
            backgroundColor: 'gray',
            borderColor: 'black',
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={() => setOpenTopicWords(!openTopicWords)}>
            <Text>Open words</Text>
          </TouchableOpacity>
        </View>
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
          maxHeight: height * 0.7,
        }}>
        <View>
          <FlowSetting
            isFlowingSentences={isFlowingSentences}
            setIsFlowingSentences={setIsFlowingSentences}
          />
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text style={{fontSize: 20}}>
              {topicData?.map(topicSentence => {
                const id = topicSentence.id;
                const focusThisSentence = id === masterPlay;

                return (
                  <Text
                    key={id}
                    style={{
                      backgroundColor: focusThisSentence
                        ? 'yellow'
                        : 'transparent',
                    }}>
                    <SatoriLine
                      focusThisSentence={focusThisSentence}
                      getSafeText={getSafeText}
                      topicSentence={topicSentence}
                      playFromThisSentence={playFromThisSentence}
                    />
                  </Text>
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
            progress={progress}
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

const SatoriLine = ({
  focusThisSentence,
  playFromThisSentence,
  getSafeText,
  topicSentence,
}) => {
  const [showEng, setShowEng] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  return (
    <Text
      selectable={true}
      style={{
        backgroundColor: focusThisSentence ? 'yellow' : 'transparent',
      }}>
      <TouchableOpacity onPress={() => playFromThisSentence(topicSentence.id)}>
        <Text style={{marginRight: 5}}>▶️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEng(!showEng)}>
        <Text style={{marginRight: 5}}>🇬🇧</Text>
      </TouchableOpacity>
      {topicSentence.notes ? (
        <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
          <Text style={{marginRight: 5}}>☝🏽</Text>
        </TouchableOpacity>
      ) : null}
      {getSafeText(topicSentence.targetLang)}
      {showEng ? <Text selectable={true}>{topicSentence.baseLang}</Text> : null}
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
    </Text>
  );
};

export default TopicContent;
