import React, {useEffect} from 'react';
import useSoundHook from '../hooks/useSoundHook';
import AudioToggles from './AudioToggles';

const SoundWidget = ({
  soundRef,
  url,
  topicName,
  sentence,
  isPlaying,
  setIsPlaying,
  currentTimeState,
  setCurrentTimeState,
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

  const handleForward = (isForward: boolean) => {
    if (isForward) {
      forwardSound();
    } else {
      rewindSound();
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };
  const progress = currentTimeState / soundDuration;

  return (
    <AudioToggles
      isPlaying={isPlaying}
      playSound={handlePlay}
      progress={progress}
      seekHandler={handleForward}
    />
  );
};

export default SoundWidget;
