import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

const useLoadAudioInstance = ({soundRef, url}) => {
  const [triggerHook, setTriggerHook] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const triggerLoadURL = () => {
    setTriggerHook(true);
  };

  useEffect(() => {
    if (!triggerHook || !url) {
      return;
    }

    if (soundRef?.current?.isLoaded()) {
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
      setIsLoaded(true);
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [triggerHook, soundRef]);

  return {triggerLoadURL, isLoaded};
};

export default useLoadAudioInstance;
