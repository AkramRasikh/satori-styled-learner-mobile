import {useEffect} from 'react';

const useSnippetManageAudioStop = ({
  soundRef,
  isPlaying,
  setIsPlaying,
  startTime,
  duration,
  currentTime,
}) => {
  useEffect(() => {
    if (currentTime) {
      const endTime = startTime + duration;
      if (currentTime > endTime && isPlaying) {
        soundRef.current.stop(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTime, soundRef, setIsPlaying, startTime, duration, isPlaying]);
};

export default useSnippetManageAudioStop;
