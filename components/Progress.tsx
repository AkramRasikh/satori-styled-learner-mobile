import React from 'react';
import {View, Text} from 'react-native';
import {ProgressBar} from 'react-native-paper';

const ProgressBarComponent = ({progress, time}) => {
  return (
    <View style={{padding: 10}}>
      <ProgressBar progress={progress} style={{marginTop: 20, height: 10}} />
      <Text>{time}</Text>
    </View>
  );
};

export default ProgressBarComponent;
