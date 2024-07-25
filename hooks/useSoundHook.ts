import Sound from 'react-native-sound';
import useBackgroundAudioHook from './useBackgroundAudioHook';
import useSyncRefAudioAndState from './useSyncRefAudioAndState';
import useSnippetManageAudioStop from './useSnippetManageAudioStop';
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
  duration,
  soundInstance,
  currentTime,
  setCurrentTime,
  index,
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

  useSnippetManageAudioStop({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime,
    duration,
    currentTime,
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
