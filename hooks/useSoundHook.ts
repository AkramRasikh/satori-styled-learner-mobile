import {useEffect} from 'react';
import Sound from 'react-native-sound';

const useSoundHook = ({url, soundRef, isPlaying, setIsPlaying}) => {
  useEffect(() => {
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

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.play(success => {
        if (success) {
          console.log('Successfully finished playing');
          setIsPlaying(false);
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });
      setIsPlaying(true);
    }
  };

  const pauseSound = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const rewindSound = () => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(seconds => {
        let newTime = seconds - 5;
        if (newTime < 0) newTime = 0;
        soundRef.current.setCurrentTime(newTime);
        console.log(`Rewind to ${newTime} seconds`);
      });
    }
  };

  const forwardSound = () => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(seconds => {
        let newTime = seconds + 5;
        const duration = soundRef.current.getDuration();
        if (newTime > duration) newTime = duration;
        soundRef.current.setCurrentTime(newTime);
        console.log(`Forward to ${newTime} seconds`);
      });
    }
  };

  return {
    playSound,
    pauseSound,
    rewindSound,
    forwardSound,
  };
};

export default useSoundHook;
