import React from 'react';
import AudioToggles from '../AudioToggles';
import useSound from './context/useSound';

const SoundWidget = () => {
  const {isPlaying, handlePlay, progress, handleForward} = useSound();
  return (
    <AudioToggles
      isPlaying={isPlaying}
      playSound={handlePlay}
      progress={progress}
      seekHandler={handleForward}
    />
  );
};

export default SoundWidget;
