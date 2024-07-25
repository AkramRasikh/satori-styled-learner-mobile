import {useEffect} from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const useSyncRefAudioAndState = ({soundRef, isSnippet, setCurrentTime}) => {
  useEffect(() => {
    const updateCurrentTime = () => {
      if (soundRef.current && isSnippet) {
        soundRef.current.getCurrentTime(seconds => {
          setCurrentTime(seconds);
        });
      }
    };

    const interval = setInterval(updateCurrentTime, 300); // Update every second

    return () => {
      clearInterval(interval);
    };
  }, [soundRef, setCurrentTime, isSnippet]);
};

export default useSyncRefAudioAndState;
