import React, {View} from 'react-native';
import {IconButton, MD2Colors} from 'react-native-paper';
import ProgressBarComponent from './ProgressBar';
import useTopicContentAudio from './TopicContent/context/useTopicContentAudio';

const TopicContentAudioSection = ({
  initSnippet,
  soundDuration,
  setShowReviewSectionState,
}) => {
  const {
    playSound,
    pauseSound,
    rewindSound,
    forwardSound,
    isPlaying,
    currentTimeState,
    handlePreviousSentence,
    handleLoopThisSentence,
  } = useTopicContentAudio();

  const progressRate = currentTimeState / soundDuration || 0;
  const text = `${currentTimeState?.toFixed(2)}/${soundDuration?.toFixed(2)}`;

  return (
    <View
      style={{
        padding: 10,
        gap: 10,
      }}>
      <ProgressBarComponent
        progressWidth={'75%'}
        progress={progressRate}
        text={text}
      />
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
        <IconButton mode="contained" onPress={initSnippet} icon="content-cut" />
        <IconButton mode="contained" onPress={rewindSound} icon="rewind" />
        <IconButton
          mode="contained"
          onPress={forwardSound}
          icon="fast-forward"
        />
        <IconButton
          mode="contained"
          onPress={handlePreviousSentence}
          icon="skip-backward"
        />
        <IconButton
          mode="contained"
          onPress={isPlaying ? pauseSound : playSound}
          onLongPress={handleLoopThisSentence}
          icon={isPlaying ? 'pause' : 'play'}
          containerColor={isPlaying ? MD2Colors.green300 : MD2Colors.grey300}
        />
      </View>
    </View>
  );
};

export default TopicContentAudioSection;
