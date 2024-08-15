import React from 'react';
import {Button, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

const SoundComponent = ({
  soundRef,
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
  getTimeStamp,
  jumpAudioValue,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
      }}>
      <View
        style={{
          marginHorizontal: 5,
          backgroundColor: isPlaying ? 'green' : 'red',
          borderRadius: 10,
        }}>
        {isPlaying ? (
          <Button title="⏸️" onPress={pauseSound} disabled={!isPlaying} />
        ) : (
          <Button title="▶️" onPress={playSound} disabled={isPlaying} />
        )}
      </View>
      <View
        style={{
          marginHorizontal: 5,
          borderLeftColor: 'black',
          borderLeftWidth: 1,
          paddingLeft: 10,
        }}>
        <Button
          title={jumpAudioValue ? `-${jumpAudioValue}s` : '-5s'}
          onPress={rewindSound}
          disabled={!soundRef.current}
        />
      </View>
      <View
        style={{
          marginHorizontal: 5,
          borderLeftColor: 'black',
          borderLeftWidth: 1,
          paddingLeft: 10,
        }}>
        <Button
          title={jumpAudioValue ? `+${jumpAudioValue}s` : '+5s'}
          onPress={forwardSound}
          disabled={!soundRef.current}
        />
      </View>
      {getTimeStamp ? (
        <TouchableOpacity
          onPress={getTimeStamp}
          style={{
            marginHorizontal: 5,
            borderLeftColor: 'black',
            borderLeftWidth: 1,
            paddingLeft: 10,
          }}>
          <Text style={{marginRight: 5}}>🤏🏾</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SoundComponent;
