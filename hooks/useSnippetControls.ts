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
      id: snippet.id,
      sentenceId: snippet.sentenceId,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
      startAt: snippet.startAt,
      isIsolated: snippet.isIsolated,
      targetLang: snippet.targetLang,
      topicName: snippet.topicName,
      url: snippet.url,
    };
    addSnippet(formattedSnippet);
  };
  const handleRemoveSnippet = () => {
    removeSnippet({snippetId: snippet.id, sentenceId: snippet.sentenceId});
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
