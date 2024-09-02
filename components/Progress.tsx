import React from 'react';
import {View, Text} from 'react-native';
import {ProgressBar} from 'react-native-paper';

const ProgressBarComponent = ({
  progress,
  time,
  endTime,
  noMargin,
  noPadding,
}) => {
  return (
    <View style={{padding: !noPadding ? 10 : 0, width: '100%'}}>
      <ProgressBar
        progress={progress}
        style={{marginTop: !noMargin ? 20 : 0, height: 10}}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <Text>{time}</Text>
        {endTime && <Text>{endTime}</Text>}
      </View>
    </View>
  );
};

export default ProgressBarComponent;
