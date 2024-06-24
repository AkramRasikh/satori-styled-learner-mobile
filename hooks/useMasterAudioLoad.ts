import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

const useMasterAudioLoad = ({soundRef, url, masterSoundState}) => {
  const [soundState, setSoundState] = useState(null);
  useEffect(() => {
    if (soundRef?.current?.isLoaded()) {
      return;
    }
    if (url) {
      const soundInstance = new Sound(url, '', error => {
        if (error) {
          console.log('## Failed to load the sound', error);
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
    }
  }, [url, soundRef, masterSoundState]);

  return soundState;
};

export default useMasterAudioLoad;
