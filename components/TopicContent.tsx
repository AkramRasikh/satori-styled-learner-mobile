import {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
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
}) => {
  const [masterPlay, setMasterPlay] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundRef = useRef(null);

  const url = getFirebaseAudioURL(topicName);

  const {playSound, pauseSound, rewindSound, forwardSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isPlaying,
  });

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique,
  });

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);

    return textSegments.map((segment, index) => (
      <Text key={index} style={[segment.style]}>
        {segment.text}
      </Text>
    ));
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

  const durations = useGetCombinedAudioData({
    hasUnifiedMP3File,
    audioFiles: orderedContent,
  });

  const durationsLengths = durations.length;
  const topicDataLengths = topicData?.length;

  const isLoading = durationsLengths !== topicDataLengths;

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

  if (isLoading) {
    return <Text>Loading</Text>;
  }

  return (
    <>
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
      {isContainerOpen ? (
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
      ) : null}
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
      {showEng ? <Text>{topicSentence.baseLang}</Text> : null}
      {showNotes ? <Text>{topicSentence.notes}</Text> : null}
    </Text>
  );
};

export default TopicContent;
