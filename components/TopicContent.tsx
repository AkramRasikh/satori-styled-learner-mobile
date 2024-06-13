import {useEffect, useRef, useState} from 'react';
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
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';

const TopicContent = ({
  topicName,
  japaneseLoadedContent,
  japaneseLoadedContentFullMP3s,
  pureWordsUnique,
  structuredUnifiedData,
  setStructuredUnifiedData,
  japaneseLoadedWords,
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const [isFlowingSentences, setIsFlowingSentences] = useState(true);
  const [isSentenceSnipping, setIsSentenceSnipping] = useState(true);
  const [longPressedWord, setLongPressedWord] = useState();
  const [miniSnippets, setMiniSnippets] = useState([]);

  const soundRef = useRef(null);
  const audioControlsRef = useRef(null);

  const {height} = Dimensions?.get('window');
  const url = getFirebaseAudioURL(topicName);

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

  const isLoading = durationsLengths !== topicDataLengths;

  useEffect(() => {
    if (!hasAlreadyBeenUnified && durationsLengths === topicDataLengths) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: durations,
      }));
    }
  }, [structuredUnifiedData, topicName, durations, topicData]);

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

  const getTimeStamp = () => {
    const thisItem = durations.find(item => item.id === masterPlay);
    const pointInAudio = thisItem.startAt;
    const targetLang = thisItem.targetLang;
    const itemToSave = {
      id: masterPlay,
      pointInAudio,
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

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  return (
    <View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{
          maxHeight: height * 0.7,
        }}>
        <View>
          <LoopMode isLoopMode={isLoopMode} setIsLoopMode={setIsLoopMode} />
          <FlowSetting
            isFlowingSentences={isFlowingSentences}
            setIsFlowingSentences={setIsFlowingSentences}
          />
          {longPressedWord ? (
            <View style={{marginBottom: 15}}>
              <Text>{getLongPressedWordData()}</Text>
            </View>
          ) : null}
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
      {miniSnippets?.length > 0 &&
        miniSnippets?.map((snippet, index) => {
          return (
            <MiniSnippetsComponent
              key={index}
              snippet={snippet}
              setMasterAudio={setIsPlaying}
              masterAudio={isPlaying}
            />
          );
        })}
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

const LoopMode = ({isLoopMode, setIsLoopMode}) => {
  return (
    <View style={{margin: 'auto', padding: 10}}>
      <TouchableOpacity onPress={() => setIsLoopMode(!isLoopMode)}>
        <Text>{isLoopMode ? 'Looping 🔄' : 'Auto ➡️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const FlowSetting = ({isFlowingSentences, setIsFlowingSentences}) => {
  return (
    <View style={{margin: 'auto', padding: 10}}>
      <TouchableOpacity
        onPress={() => setIsFlowingSentences(!isFlowingSentences)}>
        <Text>{isFlowingSentences ? 'Flowing 🏄🏽' : 'One By One 🧱'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const MiniSnippetsComponent = ({snippet, setMasterAudio, masterAudio}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState();
  const [adjustableDuration, setAdjustableDuration] = useState();

  const soundRef = useRef();

  const url = snippet.url;
  const targetLang = snippet.targetLang;
  const pointInAudio = snippet.pointInAudio;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  useEffect(() => {
    if (!adjustableStartTime && !adjustableDuration) {
      setAdjustableStartTime(pointInAudio);
      setAdjustableDuration(5);
    }
  }, [
    adjustableStartTime,
    pointInAudio,
    adjustableDuration,
    setAdjustableDuration,
    setAdjustableStartTime,
  ]);

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: adjustableStartTime,
    duration: adjustableDuration,
  });

  const handleSetEarlierTime = forward => {
    const newAdjustableTime = forward
      ? adjustableStartTime - 1
      : adjustableStartTime + 1;
    setAdjustableStartTime(newAdjustableTime);
  };

  const handleSetDuration = increase => {
    const newAdjustableDuration = increase
      ? adjustableDuration + 1
      : adjustableDuration - 1;

    setAdjustableDuration(newAdjustableDuration);
  };

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: isPlaying ? 'green' : 'red',
        }}>
        {isPlaying ? (
          <TouchableOpacity onPress={pauseSound}>
            <Text>⏸️ Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={playSound}>
            <Text>▶️ Play</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{padding: 10}}>{targetLang}</Text>
      <View
        style={{
          marginHorizontal: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={handleSetEarlierTime}>
            <Text>-1 ⏪ {adjustableStartTime?.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => handleSetEarlierTime(true)}>
            <Text>+1 ⏩ {adjustableStartTime?.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => handleSetDuration(true)}>
            <Text>duration (+1) {adjustableDuration}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSetDuration(false)}>
            <Text>duration (-1) {adjustableDuration}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TopicContent;
