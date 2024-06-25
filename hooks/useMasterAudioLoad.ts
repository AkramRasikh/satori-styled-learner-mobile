import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

const useMasterAudioLoad = ({soundRef, url}) => {
  const [soundState, setSoundState] = useState(null);
  useEffect(() => {
    if (!url) {
      return;
    }

    // If already loaded, do not reload
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

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, [url]); // Only depend on the URL to prevent unnecessary reloads

  return soundState;
};

export default useMasterAudioLoad;
