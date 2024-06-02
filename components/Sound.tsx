import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import Sound from 'react-native-sound';

const SoundComponent = ({url}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        setSound(soundInstance);
      });

      return () => {
        if (soundInstance) {
          soundInstance.release();
        }
      };
    }
  }, [url]);

  const playSound = () => {
    if (sound) {
      sound.play(success => {
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
    if (sound && isPlaying) {
      sound.pause();
      setIsPlaying(false);
    }
  };

  const rewindSound = () => {
    if (sound) {
      sound.getCurrentTime(seconds => {
        let newTime = seconds - 5;
        if (newTime < 0) newTime = 0;
        sound.setCurrentTime(newTime);
        console.log(`Rewind to ${newTime} seconds`);
      });
    }
  };

  const forwardSound = () => {
    if (sound) {
      sound.getCurrentTime(seconds => {
        let newTime = seconds + 5;
        const duration = sound.getDuration();
        if (newTime > duration) newTime = duration;
        sound.setCurrentTime(newTime);
        console.log(`Forward to ${newTime} seconds`);
      });
    }
  };

  return (
    <View>
      <Button title="Play" onPress={playSound} disabled={isPlaying} />
      <Button title="Pause" onPress={pauseSound} disabled={!isPlaying} />
      <Button title="Rewind (-5s)" onPress={rewindSound} disabled={!sound} />
      <Button title="Forward (+5s)" onPress={forwardSound} disabled={!sound} />
    </View>
  );
};

export default SoundComponent;
