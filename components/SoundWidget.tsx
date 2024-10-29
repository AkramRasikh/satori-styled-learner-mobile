import {View} from 'react-native';
import {useEffect} from 'react';
import useSoundHook from '../hooks/useSoundHook';
import SoundSmallSize from './SoundSmallSize';
import ProgressBarComponent from './Progress';

const SoundWidget = ({
  soundRef,
  url,
  topicName,
  handleSnippet,
  sentence,
  isPlaying,
  setIsPlaying,
  currentTimeState,
  setCurrentTimeState,
  noSnips,
  isMediaContent,
}) => {
  const jumpAudioValue = 2;
  const soundDuration = soundRef.current._duration;

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current?.isPlaying()) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [soundRef, setCurrentTimeState]);

  const handleSnippetFunc = () => {
    handleSnippet(currentTimeState);
    pauseSound();
  };

  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    rewindForwardInterval: jumpAudioValue,
    startTime: isMediaContent ? sentence.time : null,
    isMediaContent,
  });

  return (
    <View>
      <ProgressBarComponent
        endTime={soundDuration.toFixed(2)}
        progress={currentTimeState / soundDuration}
        time={currentTimeState.toFixed(2)}
        noMargin
        noPadding
      />
      <SoundSmallSize
        soundRef={soundRef}
        isPlaying={isPlaying}
        playSound={playSound}
        pauseSound={pauseSound}
        rewindSound={() => rewindSound(jumpAudioValue)}
        forwardSound={() => forwardSound(jumpAudioValue)}
        jumpAudioValue={jumpAudioValue}
        handleSnippet={handleSnippetFunc}
        noSnips={noSnips}
      />
    </View>
  );
};

export default SoundWidget;
