import {useEffect} from 'react';

const useAudioTextSync = ({
  currentTimeState,
  isFlowingSentences,
  soundRef,
  setIsPlaying,
  topicData,
  masterPlay,
  setCurrentTimeState,
  setMasterPlay,
  secondsToSentencesMapState,
}) => {
  useEffect(() => {
    if (currentTimeState && !isFlowingSentences) {
      const currentAudioPlayingObj = topicData.find(
        item =>
          currentTimeState < (item.endAt || soundRef?.current?.duration) &&
          currentTimeState > item.startAt,
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
    masterPlay,
    setIsPlaying,
    isFlowingSentences,
    soundRef,
  ]);

  useEffect(() => {
    if (currentTimeState && secondsToSentencesMapState?.length > 0) {
      setMasterPlay(secondsToSentencesMapState[Math.floor(currentTimeState)]);
    }
  }, [secondsToSentencesMapState, setMasterPlay, currentTimeState]);

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
};

export default useAudioTextSync;
