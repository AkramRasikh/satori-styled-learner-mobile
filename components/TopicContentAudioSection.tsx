import React, {View} from 'react-native';
import {Button, MD3Colors, ProgressBar} from 'react-native-paper';

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
  jumpAudioValue = 5,
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
        <Button
          mode="contained"
          onPress={() => setShowReviewSectionState(prev => !prev)}
          buttonColor="grey">
          🕰️
        </Button>
        <Button mode="contained" onPress={getTimeStamp} buttonColor="grey">
          ✂️
        </Button>
        <Button mode="contained" onPress={rewindSound} buttonColor="grey">
          -{jumpAudioValue}
        </Button>
        <Button mode="contained" onPress={forwardSound} buttonColor="grey">
          +{jumpAudioValue}
        </Button>
        {isPlaying ? (
          <Button mode="contained" onPress={pauseSound} buttonColor={'green'}>
            ⏸️
          </Button>
        ) : (
          <Button mode="contained" onPress={playSound} buttonColor={'red'}>
            ▶️
          </Button>
        )}
      </View>
    </View>
  );
};

export default TopicContentAudioSection;
