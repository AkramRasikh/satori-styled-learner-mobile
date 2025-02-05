import React, {View} from 'react-native';
import {IconButton} from 'react-native-paper';

import useMainAudioControls from '../../hooks/useMainAudioControls';

const DifficultSentenceAudioControls = ({
  sentence,
  handleLoad,
  isLoaded,
  isPlaying,
  setIsPlaying,
  soundRef,
  handleSnippet,
}) => {
  const {playSound, pauseSound, forwardSound, rewindSound} =
    useMainAudioControls({
      soundRef,
      isPlaying,
      setIsPlaying,
      startTime: sentence?.isMediaContent ? sentence.time : null,
      rewindForwardInterval: 2,
      isMediaContent: sentence?.isMediaContent,
    });

  const handleSnippetFunc = () => {
    handleSnippet();
    pauseSound();
  };

  const handlePlay = () => {
    if (!isLoaded) {
      handleLoad();
    } else {
      if (isPlaying) {
        pauseSound();
      } else {
        playSound();
      }
    }
  };

  const btnArr = [
    {
      icon: 'rewind',
      onPress: rewindSound,
    },
    {
      icon: isLoaded && isPlaying ? 'pause' : 'play',
      onPress: handlePlay,
    },
    {
      icon: 'fast-forward',
      onPress: forwardSound,
    },
    {
      icon: 'content-cut',
      onPress: handleSnippetFunc,
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      {btnArr.map((btn, index) => {
        return (
          <IconButton
            key={index}
            icon={btn.icon}
            mode="outlined"
            size={15}
            onPress={btn.onPress}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentenceAudioControls;
