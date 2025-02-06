import React from 'react';
import {SegmentedButtons} from 'react-native-paper';

// scale to options a/b/c
const PillButton = ({buttons, value, onValueChange}) => {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={onValueChange}
      buttons={buttons}
    />
  );
};

export default PillButton;
