import React from 'react';
import {SegmentedButtons} from 'react-native-paper';

const PillButton = ({buttons, value, onValueChange}) => (
  <SegmentedButtons
    value={value}
    onValueChange={onValueChange}
    buttons={buttons}
  />
);

export default PillButton;
