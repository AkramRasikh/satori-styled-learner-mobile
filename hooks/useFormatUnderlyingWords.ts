import {useEffect} from 'react';

const useFormatUnderlyingWords = ({
  setFormattedData,
  formatTextForTargetWords,
  formattedData,
  durations,
  setUpdateWordList,
  updateWordList,
}) => {
  useEffect(() => {
    if (formattedData?.length === 0 && durations?.length > 0) {
      setFormattedData(formatTextForTargetWords());
    } else if (formattedData?.length > 0 && updateWordList) {
      setFormattedData(formatTextForTargetWords());
      setUpdateWordList(false);
    }
  }, [
    formattedData,
    durations,
    formatTextForTargetWords,
    updateWordList,
    setFormattedData,
    setUpdateWordList,
  ]);
};

export default useFormatUnderlyingWords;
