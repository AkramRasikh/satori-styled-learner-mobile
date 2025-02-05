import React, {View} from 'react-native';
import {IconButton} from 'react-native-paper';

import useSoundHook from '../../hooks/useSoundHook';
import useDifficultSentenceContext from '../NewDifficultBase/context/useDifficultSentence';

const NewAudioControls = ({sentence}) => {
  const {
    handleLoad,
    isLoaded,
    isPlaying,
    setIsPlaying,
    soundRef,
    handleSnippet,
  } = useDifficultSentenceContext();

  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName: sentence.topic,
    rewindForwardInterval: 2,
    startTime: sentence?.isMediaContent ? sentence.time : null,
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

  const playIcon = isLoaded && isPlaying ? 'pause' : 'play';
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <IconButton
        icon="rewind"
        mode="outlined"
        size={15}
        onPress={rewindSound}
      />
      <IconButton
        icon={playIcon}
        mode="outlined"
        size={15}
        onPress={handlePlay}
      />
      <IconButton
        icon="fast-forward"
        mode="outlined"
        size={15}
        onPress={forwardSound}
      />
      <IconButton
        icon="content-cut"
        mode="outlined"
        size={15}
        onPress={handleSnippetFunc}
      />
    </View>
  );
};

export default NewAudioControls;
