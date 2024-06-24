import React from 'react';
import {View, Text} from 'react-native';
import {ProgressBar} from 'react-native-paper';

const ProgressBarComponent = ({progress, time, endTime}) => {
  return (
    <View style={{padding: 10, width: '100%'}}>
      <ProgressBar progress={progress} style={{marginTop: 20, height: 10}} />
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
