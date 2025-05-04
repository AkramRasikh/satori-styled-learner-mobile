import React from 'react';
import {View} from 'react-native';
import {
  ProgressBar,
  MD3Colors,
  IconButton,
  MD2Colors,
} from 'react-native-paper';

const AudioToggles = ({
  isPlaying,
  playSound,
  seekHandler,
  progress,
  setShowReviewSectionState,
  handleLoopThisSentence,
}) => (
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
      {setShowReviewSectionState && (
        <IconButton
          mode="contained"
          onPress={() => setShowReviewSectionState(prev => !prev)}
          icon="clock"
        />
      )}
      <IconButton
        mode="contained"
        onPress={() => seekHandler(false)}
        icon="rewind"
      />
      <IconButton
        mode="contained"
        onPress={() => seekHandler(true)}
        icon="fast-forward"
      />
      <IconButton
        mode="contained"
        onPress={playSound}
        icon={isPlaying ? 'pause' : 'play'}
        containerColor={isPlaying ? MD2Colors.green300 : MD2Colors.grey300}
        onLongPress={handleLoopThisSentence && handleLoopThisSentence}
      />
    </View>
  </View>
);

export default AudioToggles;
