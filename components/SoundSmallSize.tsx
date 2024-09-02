import React from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';

const SoundSmallSize = ({
  soundRef,
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
  jumpAudioValue,
  handleSnippet,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
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
      <TouchableOpacity
        onPress={handleSnippet}
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text>✂️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SoundSmallSize;
