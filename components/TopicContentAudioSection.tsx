import React, {View} from 'react-native';
import {Button, MD3Colors, ProgressBar} from 'react-native-paper';

const TopicContentAudioSection = ({
  isPlaying,
  playSound,
  pauseSound,
  rewindSound,
  forwardSound,
  // getTimeStamp,
  // currentTimeState,
  // soundDuration,
  jumpAudioValue = 5,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        gap: 5,
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
        <Button mode="contained" onPress={forwardSound} buttonColor="grey">
          +{jumpAudioValue}
        </Button>
        <Button mode="contained" onPress={rewindSound} buttonColor="grey">
          -{jumpAudioValue}
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
