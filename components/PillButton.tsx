import React from 'react';
import {SegmentedButtons} from 'react-native-paper';

// scale to options a/b/c
const PillButton = ({btnsArr, value, onValueChange}) => {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={onValueChange}
      buttons={btnsArr}
    />
  );
};

export default PillButton;
