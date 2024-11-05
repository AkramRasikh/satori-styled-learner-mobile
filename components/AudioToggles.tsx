import React from 'react';
import {View} from 'react-native';
import {Button, ProgressBar, MD3Colors} from 'react-native-paper';

const AudioToggles = ({
  isPlaying,
  playSound,
  seekHandler,
  jumpAudioValue,
  progress,
  // seekToTimestamp,
  // getTimeStamp,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
      }}>
      <View
        style={{
          flex: 2,
          marginVertical: 'auto',
        }}>
        <ProgressBar progress={progress} color={MD3Colors.error50} />
      </View>
      <View
        style={{
          gap: 5,
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Button
          mode="contained"
          onPress={() => seekHandler(false)}
          buttonColor="grey">
          -{jumpAudioValue}
        </Button>
        <Button
          mode="contained"
          onPress={() => seekHandler(true)}
          buttonColor="grey">
          +{jumpAudioValue}
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
