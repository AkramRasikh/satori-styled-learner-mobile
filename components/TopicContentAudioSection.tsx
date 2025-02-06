import React, {View} from 'react-native';
import {
  IconButton,
  MD2Colors,
  MD3Colors,
  ProgressBar,
} from 'react-native-paper';

const TopicContentAudioSection = ({
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
  getTimeStamp,
  currentTimeState,
  soundDuration,
  setShowReviewSectionState,
}) => {
  const progress =
    soundDuration && currentTimeState ? currentTimeState / soundDuration : 0;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        gap: 10,
      }}>
      <View>
        <View
          style={{
            flex: 2,
            marginVertical: 'auto',
          }}>
          <ProgressBar progress={progress} color={MD3Colors.error50} />
        </View>
      </View>

      <View
        style={{
          gap: 5,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <IconButton
          mode="contained"
          onPress={() => setShowReviewSectionState(prev => !prev)}
          icon="clock"
        />
        <IconButton
          mode="contained"
          onPress={getTimeStamp}
          icon="content-cut"
        />
        <IconButton mode="contained" onPress={rewindSound} icon="rewind" />
        <IconButton
          mode="contained"
          onPress={forwardSound}
          icon="fast-forward"
        />
        <IconButton
          mode="contained"
          onPress={isPlaying ? pauseSound : playSound}
          icon={isPlaying ? 'pause' : 'play'}
          containerColor={isPlaying ? MD2Colors.green300 : MD2Colors.grey300}
        />
      </View>
    </View>
  );
};

export default TopicContentAudioSection;
