import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

const useLoadAudioInstance = ({soundRef, url}) => {
  const [soundState, setSoundState] = useState(null);

  const triggerLoadURL = () => {
    if (soundRef?.current?.isLoaded()) {
      setSoundState(soundRef.current);
      return;
    }
    const soundInstance = new Sound(url, '', error => {
      if (error) {
        console.error('## Failed to load the sound', error);
        return;
      }
      console.log(
        'Duration in seconds: ' +
          soundInstance.getDuration() +
          ' number of channels: ' +
          soundInstance.getNumberOfChannels(),
      );
      soundRef.current = soundInstance;
      setSoundState(soundInstance);
    });
  };

  useEffect(() => {
    if (!url) {
      return;
    }

    // If already loaded, do not reload
    if (soundRef?.current?.isLoaded()) {
      setSoundState(soundRef.current);
      return;
    }
    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [soundState, soundRef]);

  return {triggerLoadURL, soundState};
};

export default useLoadAudioInstance;
