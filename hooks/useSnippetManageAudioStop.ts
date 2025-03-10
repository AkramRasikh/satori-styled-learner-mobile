import {useEffect} from 'react';

const useSnippetManageAudioStop = ({
  soundRef,
  isPlaying,
  setIsPlaying,
  startTime,
  duration,
  currentTime,
  setCurrentTimeState,
}) => {
  useEffect(() => {
    if (currentTime) {
      const endTime = startTime + duration;
      if (currentTime > endTime && isPlaying) {
        soundRef.current.stop(() => {
          setIsPlaying(false);
        });
        soundRef.current.setCurrentTime(startTime);
        soundRef.current.getCurrentTime(currentTime => {
          setCurrentTimeState(currentTime);
          setIsPlaying(false);
        });
      }
    }
  }, [
    currentTime,
    soundRef,
    setCurrentTimeState,
    setIsPlaying,
    startTime,
    duration,
    isPlaying,
  ]);
};

export default useSnippetManageAudioStop;
