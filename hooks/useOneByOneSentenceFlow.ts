import {useEffect} from 'react';

const useOneByOneSentenceFlow = ({
  currentTimeState,
  isFlowingSentences,
  soundRef,
  setIsPlaying,
  durations,
  masterPlay,
}) => {
  useEffect(() => {
    if (currentTimeState && !isFlowingSentences) {
      const currentAudioPlayingObj = durations.find(
        item =>
          currentTimeState < (item.endAt || soundRef?.current?.durations) &&
          currentTimeState > item.startAt,
      );

      if (!currentAudioPlayingObj) {
        return;
      }
      const currentAudioPlayingIndex = currentAudioPlayingObj?.position;

      const newLine = durations[currentAudioPlayingIndex];
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
    durations,
    masterPlay,
    setIsPlaying,
    isFlowingSentences,
    soundRef,
  ]);
};

export default useOneByOneSentenceFlow;
