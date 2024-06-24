import {useEffect} from 'react';
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

  useEffect(() => {
    if (currentTime) {
      const endTime = startTime + duration;
      if (currentTime > endTime && isPlaying) {
        soundRef.current.stop(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [
    currentTime,
    soundRef,
    setIsPlaying,
    startTime,
    duration,
    isPlaying,
    index,
  ]);

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
