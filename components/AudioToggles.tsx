import React from 'react';
import {View} from 'react-native';
import {Button, ProgressBar, MD3Colors} from 'react-native-paper';

const AudioToggles = ({
  soundRef,
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
  getTimeStamp,
  jumpAudioValue,
  seekToTimestamp,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        gap: 10,
      }}>
      <View
        style={{
          flex: 2,
          marginVertical: 'auto',
        }}>
        <ProgressBar progress={0.5} color={MD3Colors.error50} />
      </View>
      <View
        style={{
          gap: 5,
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Button
          mode="contained"
          onPress={() => seekToTimestamp(20)}
          buttonColor="grey">
          +{jumpAudioValue}
        </Button>
        <Button
          mode="contained"
          onPress={() => seekToTimestamp(20)}
          buttonColor="grey">
          -{jumpAudioValue}
        </Button>
        <Button
          mode="contained"
          onPress={playSound}
          buttonColor={isPlaying ? 'green' : 'red'}>
          {isPlaying ? '⏸️' : '▶️'}
        </Button>
      </View>
    </View>
  );
};

export default AudioToggles;
