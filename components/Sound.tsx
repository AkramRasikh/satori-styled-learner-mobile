import React from 'react';
import {Button, View} from 'react-native';

const SoundComponent = ({
  soundRef,
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
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
          title="-5s"
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
          title="+5s"
          onPress={forwardSound}
          disabled={!soundRef.current}
        />
      </View>
    </View>
  );
};

export default SoundComponent;
