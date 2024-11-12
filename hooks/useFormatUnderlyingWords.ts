import {useEffect} from 'react';

const useFormatUnderlyingWords = ({
  setFormattedData,
  formatTextForTargetWords,
  formattedData,
  contentWithTimeStamps,
  setUpdateWordList,
  updateWordList,
}) => {
  useEffect(() => {
    if (formattedData?.length === 0 && contentWithTimeStamps?.length > 0) {
      setFormattedData(formatTextForTargetWords());
    } else if (formattedData?.length > 0 && updateWordList) {
      setFormattedData(formatTextForTargetWords());
      setUpdateWordList(false);
    }
  }, [
    formattedData,
    contentWithTimeStamps,
    formatTextForTargetWords,
    updateWordList,
    setFormattedData,
    setUpdateWordList,
  ]);
};

export default useFormatUnderlyingWords;
