import {useEffect} from 'react';
import Sound from 'react-native-sound';

const useMasterAudioLoad = ({soundRef, url}) => {
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
      });

      return () => {
        if (soundRef.current) {
          soundRef.current.release();
        }
      };
    }
  }, [url, soundRef]);
};

export default useMasterAudioLoad;
