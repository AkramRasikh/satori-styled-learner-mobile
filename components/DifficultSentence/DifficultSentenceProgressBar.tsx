import React from 'react-native';
import ProgressBarComponent from '../ProgressBar';

const DifficultSentenceProgressBar = ({
  currentTimeState,
  soundDuration,
  isLoaded,
}) => {
  const progressRate = (isLoaded && currentTimeState / soundDuration) || 0;
  const text = `${currentTimeState?.toFixed(2)}/${soundDuration?.toFixed(2)}`;

  return (
    <ProgressBarComponent
      progressWidth={'75%'}
      progress={progressRate}
      text={text}
    />
  );
};

export default DifficultSentenceProgressBar;
