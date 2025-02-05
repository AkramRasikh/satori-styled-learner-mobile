import React, {Text, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import useDifficultSentenceContext from '../NewDifficultBase/context/useDifficultSentence';

const DifficultSentenceProgressBar = () => {
  const {currentTimeState, soundDuration, isLoaded} =
    useDifficultSentenceContext();

  const progressRate = (isLoaded && currentTimeState / soundDuration) || 0;

  const audioProgressText = `${currentTimeState?.toFixed(
    2,
  )}/${soundDuration?.toFixed(2)}`;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '75%',
          alignSelf: 'center',
        }}>
        <ProgressBar progress={progressRate} style={{marginVertical: 5}} />
      </View>
      <View>
        <Text>{audioProgressText}</Text>
      </View>
    </View>
  );
};

export default DifficultSentenceProgressBar;
