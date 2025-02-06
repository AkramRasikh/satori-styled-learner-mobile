import React from 'react-native';
import PillButton from '../../components/PillButton';

const DifficultSentencesSegmentHeader = ({
  dueLength,
  allLength,
  isShowDueOnly,
  setIsShowDueOnly,
}) => {
  const dueText = isShowDueOnly ? `Due (${dueLength})` : 'Due';
  const allSentencesText = `All (${allLength})`;

  const buttons = [
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
  ];
  return (
    <PillButton
      value={isShowDueOnly}
      onValueChange={setIsShowDueOnly}
      buttons={buttons}
    />
  );
};

export default DifficultSentencesSegmentHeader;
