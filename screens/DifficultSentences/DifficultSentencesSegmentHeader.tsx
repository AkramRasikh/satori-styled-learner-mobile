import React from 'react-native';
import {SegmentedButtons} from 'react-native-paper';

const DifficultSentencesSegmentHeader = ({
  dueLength,
  allLength,
  isShowDueOnly,
  setIsShowDueOnly,
}) => {
  const dueText = isShowDueOnly ? `Due (${dueLength})` : 'Due';
  const allSentencesText = `All (${allLength})`;

  return (
    <SegmentedButtons
      value={isShowDueOnly}
      onValueChange={setIsShowDueOnly}
      buttons={[
        {
          value: true,
          label: dueText,
          icon: 'check',
          showSelectedCheck: isShowDueOnly,
        },
        {
          value: false,
          label: allSentencesText,
          icon: !isShowDueOnly ? 'check' : '',
          showSelectedCheck: !isShowDueOnly,
        },
      ]}
    />
  );
};

export default DifficultSentencesSegmentHeader;
