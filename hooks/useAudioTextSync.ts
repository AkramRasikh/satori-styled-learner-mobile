import {useEffect} from 'react';

const useAudioTextSync = ({
  currentTimeState,
  setMasterPlay,
  secondsToSentencesMapState,
}) => {
  useEffect(() => {
    if (currentTimeState && secondsToSentencesMapState?.length > 0) {
      setMasterPlay(secondsToSentencesMapState[Math.floor(currentTimeState)]);
    }
  }, [secondsToSentencesMapState, setMasterPlay, currentTimeState]);
};

export default useAudioTextSync;
