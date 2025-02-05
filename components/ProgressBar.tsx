import React, {Text, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';

const ProgressBarComponent = ({progress, progressWidth, text}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
    <View
      style={{
        width: progressWidth || '75%',
        alignSelf: 'center',
      }}>
      <ProgressBar progress={progress} style={{marginVertical: 5}} />
    </View>
    {text && (
      <View>
        <Text>{text}</Text>
      </View>
    )}
  </View>
);

export default ProgressBarComponent;
