const useSnippetControls = ({
  adjustableStartTime,
  adjustableDuration,
  setAdjustableStartTime,
  setAdjustableDuration,
  snippetEndAtLimit,
  snippetStartAtLimit,
  deleteSnippet,
  addSnippet,
  removeSnippet,
  snippet,
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

  const handleDelete = () => {
    deleteSnippet(snippet.id);
  };

  const handleAddingSnippet = () => {
    // check if values already there
    const formattedSnippet = {
      ...snippet,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    addSnippet(formattedSnippet);
  };
  const handleRemoveSnippet = () => {
    const formattedSnippet = {
      ...snippet,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    removeSnippet(formattedSnippet);
  };

  return {
    handleDelete,
    handleAddingSnippet,
    handleRemoveSnippet,
    handleSetEarlierTime,
    handleSetDuration,
  };
};

export default useSnippetControls;
