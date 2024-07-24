import {useEffect, useState} from 'react';

const useSnippetHook = ({
  startTime,
  pointOfAudioOnClick,
  currentTimeState,
  setCurrentTimeState,
  soundRef,
  setMasterAudio,
  masterAudio,
  isPlaying,
  isInDB,
  pointInAudio,
  adjustableStartTime,
  duration,
  adjustableDuration,
  setAdjustableStartTime,
}) => {
  const [progressTime, setProgressTime] = useState(startTime);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const newProgressTime =
        currentTimeState === 0 ? startTime : currentTimeState;
      setProgressTime(newProgressTime);
    }
  }, [isPlaying, currentTimeState, startTime]);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        if (isInDB) {
          setProgress((currentTime - pointInAudio) / duration);
        } else {
          setProgress((currentTime - adjustableStartTime) / adjustableDuration);
        }
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    soundRef,
    pointInAudio,
    duration,
    adjustableStartTime,
    adjustableDuration,
    isInDB,
    isPlaying,
  ]);

  useEffect(() => {
    if (!adjustableStartTime) {
      setAdjustableStartTime(pointOfAudioOnClick);
    }
  }, [
    adjustableStartTime,
    pointInAudio,
    pointOfAudioOnClick,
    setAdjustableStartTime,
  ]);
  return {
    progress,
    progressTime,
  };
};

export default useSnippetHook;
