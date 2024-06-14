import {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import useBackgroundAudioHook from './useBackgroundAudioHook';

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
}) => {
  let soundInstance: Sound | null = null;

  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useBackgroundAudioHook({
    soundInstance,
    topicName,
    url,
    soundRef,
  });

  useEffect(() => {
    if (url) {
      soundInstance = new Sound(url, '', error => {
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
        setIsLoaded(true);
      });

      return () => {
        if (soundRef.current) {
          soundRef.current.release();
        }
      };
    }
  }, [url, soundRef, isLoaded, isSnippet]);

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
  }, [soundRef, isSnippet]);

  useEffect(() => {
    if (currentTime) {
      const endTime = startTime + duration;
      if (currentTime > endTime) {
        soundRef.current.stop(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentTime, soundRef, startTime, setIsPlaying, duration]);

  const playSound = () => {
    if (isSnippet && soundRef.current) {
      soundRef.current.setCurrentTime(startTime);
      soundRef.current.getCurrentTime(() => {
        soundRef.current.play(success => {
          if (!success) {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      });
      setIsPlaying(true);
    } else if (soundRef.current) {
      soundRef.current.play(success => {
        if (success) {
          setIsPlaying(false);
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
      });

      setIsPlaying(true);
    }
  };

  const pauseSound = () => {
    if (soundRef.current && isPlaying && isSnippet) {
      stopAudio();
    } else if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        setIsPlaying(false);
      });
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
