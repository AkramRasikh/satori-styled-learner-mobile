import {useEffect} from 'react';

const useAudioTextSync = ({
  currentTimeState,
  isFlowingSentences,
  soundRef,
  setIsPlaying,
  topicData,
  isPlaying,
  soundDuration,
  masterPlay,
  setCurrentTimeState,
  setMasterPlay,
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
    if (
      topicData?.length > 0 &&
      currentTimeState &&
      soundDuration &&
      isPlaying
    ) {
      const currentAudioPlaying = topicData.findIndex(
        item =>
          currentTimeState < (item.endAt || soundDuration) &&
          currentTimeState > item.startAt,
      );

      const newId = topicData[currentAudioPlaying]?.id;
      if (newId !== masterPlay) {
        setMasterPlay(newId);
      }
    }
  }, [
    topicData,
    setMasterPlay,
    currentTimeState,
    masterPlay,
    isPlaying,
    soundDuration,
  ]);

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
  }, [
    masterPlay,
    topicData,
    soundRef,
    soundDuration,
    setCurrentTimeState,
    setMasterPlay,
  ]);
};

export default useAudioTextSync;
