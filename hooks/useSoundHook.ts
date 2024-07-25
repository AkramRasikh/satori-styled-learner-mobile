import Sound from 'react-native-sound';
import useBackgroundAudioHook from './useBackgroundAudioHook';
import useSyncRefAudioAndState from './useSyncRefAudioAndState';
import useMainAudioControls from './useMainAudioControls';

Sound.setCategory('Playback');

const useSoundHook = ({
  url,
  soundRef,
  isPlaying,
  setIsPlaying,
  topicName,
  isSnippet,
  startTime,
  soundInstance,
  setCurrentTime,
}) => {
  useBackgroundAudioHook({
    soundInstance,
    topicName,
    url,
    soundRef,
    isSnippet,
    masterSetIsPlaying: setIsPlaying,
  });

  useSyncRefAudioAndState({
    soundRef,
    isSnippet,
    setCurrentTime,
  });

  const {playSound, pauseSound, rewindSound, forwardSound} =
    useMainAudioControls({
      soundRef,
      isPlaying,
      setIsPlaying,
      isSnippet,
      startTime,
    });

  return {
    playSound,
    pauseSound,
    rewindSound,
    forwardSound,
  };
};

export default useSoundHook;
