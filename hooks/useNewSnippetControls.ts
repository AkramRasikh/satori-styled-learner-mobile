const useNewSnippetControls = ({
  adjustableStartTime,
  adjustableDuration,
  setAdjustableStartTime,
  setAdjustableDuration,
  snippetEndAtLimit,
  snippetStartAtLimit,
}) => {
  const handleSetEarlierTime = forward => {
    const currentTimeWithPointInAudio = adjustableStartTime;
    const rewind = !forward;
    if (forward) {
      const newForwardedTime = currentTimeWithPointInAudio + 0.5;
      const newForwardWithDuration = newForwardedTime + adjustableDuration;
      if (
        newForwardedTime < snippetEndAtLimit &&
        newForwardWithDuration < snippetEndAtLimit
      ) {
        setAdjustableStartTime(newForwardedTime);
      } else {
        setAdjustableStartTime(snippetEndAtLimit);
      }
    } else if (rewind) {
      const newRewindTime = currentTimeWithPointInAudio - 0.5;
      if (newRewindTime > snippetStartAtLimit) {
        setAdjustableStartTime(newRewindTime);
      } else {
        setAdjustableStartTime(snippetStartAtLimit);
      }
    }
  };

  const handleSetDuration = increase => {
    const decrease = !increase;

    if (increase) {
      const newAdjustableDuration = adjustableDuration + 0.5;
      const newTimeWithDuration = adjustableStartTime + newAdjustableDuration;
      if (newTimeWithDuration < snippetEndAtLimit) {
        setAdjustableDuration(newAdjustableDuration);
      }
    } else if (decrease) {
      const newAdjustableDuration = adjustableDuration - 0.5;
      if (newAdjustableDuration > 0) {
        setAdjustableDuration(newAdjustableDuration);
      } else {
        setAdjustableDuration(0.5);
      }
    }
  };

  return {
    handleSetEarlierTime,
    handleSetDuration,
  };
};

export default useNewSnippetControls;
