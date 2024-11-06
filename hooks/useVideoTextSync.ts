import {useEffect} from 'react';

const useVideoTextSync = ({
  currentVideoTimeState,
  setMasterPlay,
  secondsToSentencesMapState,
}) => {
  useEffect(() => {
    if (currentVideoTimeState && secondsToSentencesMapState?.length > 0) {
      setMasterPlay(
        secondsToSentencesMapState[Math.floor(currentVideoTimeState)],
      );
    }
  }, [secondsToSentencesMapState, setMasterPlay, currentVideoTimeState]);
};

export default useVideoTextSync;
