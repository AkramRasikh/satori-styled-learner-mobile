import React from 'react';
import {SegmentedButtons} from 'react-native-paper';

const PillButton = ({isShowDueOnly, setIsShowDueOnly}) => {
  return (
    <SegmentedButtons
      value={isShowDueOnly}
      onValueChange={setIsShowDueOnly}
      buttons={[
        {
          value: true,
          label: 'Due only',
          icon: 'check',
          showSelectedCheck: isShowDueOnly,
        },
        {
          value: false,
          label: 'All',
          icon: !isShowDueOnly ? 'check' : '',
          showSelectedCheck: !isShowDueOnly,
        },
      ]}
    />
  );
};

export default PillButton;
