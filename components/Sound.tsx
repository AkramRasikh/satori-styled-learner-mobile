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
        gap: 10,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: isPlaying ? 'green' : 'red',
          borderRadius: 15,
        }}>
        {isPlaying ? (
          <Button title="⏸️" onPress={pauseSound} disabled={!isPlaying} />
        ) : (
          <Button title="▶️" onPress={playSound} disabled={isPlaying} />
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Button
          title={jumpAudioValue ? `-${jumpAudioValue}s` : '-5s'}
          onPress={rewindSound}
          disabled={!soundRef.current}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
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
            flex: 1,
            alignItems: 'center',
          }}>
          <Text>🤏🏾</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SoundComponent;
