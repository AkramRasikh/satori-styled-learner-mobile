import React from 'react';
import SoundWidget from '../WordSoundComponent';
import {Button} from 'react-native-paper';
import useSound from '../WordSoundComponent/context/useSound';

const FlashCardAudio = () => {
  const {isLoaded, handleLoad} = useSound();

  return isLoaded ? (
    <SoundWidget />
  ) : (
    <Button
      onPress={handleLoad}
      mode="outlined"
      style={{
        marginBottom: 10,
      }}>
      Load URL
    </Button>
  );
};

export default FlashCardAudio;
