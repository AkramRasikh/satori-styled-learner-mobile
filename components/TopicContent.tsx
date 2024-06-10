import {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SoundComponent from './Sound';
import useSoundHook from '../hooks/useSoundHook';
import useGetCombinedAudioData, {
  getFirebaseAudioURL,
} from '../hooks/useGetCombinedAudioData';
import ProgressBarComponent from './Progress';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';

const TopicContent = ({
  topicName,
  isContainerOpen,
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
  const [longPressedWord, setLongPressedWord] = useState();

  const soundRef = useRef(null);

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
  // {"baseForm": "いとこ", "contexts": ["9a053240-fb92-40d5-b260-14f652fdac8f"], "definition": "cousin", "id": "89e36d07-acf6-4128-ba11-d431671d2587", "phonetic": "いとこ", "surfaceForm": "いとこ", "transliteration": "Itoko"}
  return (
    <>
      {isContainerOpen ? (
        <View>
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
      ) : null}
      {hasUnifiedMP3File && (
        <View>
          <SoundComponent
            soundRef={soundRef}
            isPlaying={isPlaying}
            playSound={playSound}
            pauseSound={pauseSound}
            rewindSound={rewindSound}
            forwardSound={forwardSound}
          />
          <ProgressBarComponent
            progress={progress}
            time={currentTimeState.toFixed(2)}
          />
        </View>
      )}
    </>
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
