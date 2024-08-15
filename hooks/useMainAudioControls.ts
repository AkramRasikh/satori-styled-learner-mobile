const useMainAudioControls = ({
  soundRef,
  isPlaying,
  setIsPlaying,
  isSnippet,
  startTime,
}) => {
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

  const rewindSound = rewindNum => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(seconds => {
        let newTime = seconds - (rewindNum || 5);
        if (newTime < 0) newTime = 0;
        soundRef.current.setCurrentTime(newTime);
        console.log(`Rewind to ${newTime} seconds`);
      });
    }
  };

  const forwardSound = forwardNum => {
    if (soundRef.current) {
      soundRef.current.getCurrentTime(seconds => {
        let newTime = seconds + (forwardNum || 5);
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

export default useMainAudioControls;
