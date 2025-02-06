import React from 'react';
import {SegmentedButtons} from 'react-native-paper';

// scale to options a/b/c
const PillButton = ({
  isShowDueOnly,
  setIsShowDueOnly,
  isDueLabel,
  isNotDueLabel,
}) => {
  return (
    <SegmentedButtons
      value={isShowDueOnly}
      onValueChange={setIsShowDueOnly}
      buttons={[
        {
          value: true,
          label: isDueLabel,
          icon: 'check',
          showSelectedCheck: isShowDueOnly,
        },
        {
          value: false,
          label: isNotDueLabel,
          icon: !isShowDueOnly ? 'check' : '',
          showSelectedCheck: !isShowDueOnly,
        },
      ]}
    />
  );
};

export default PillButton;
