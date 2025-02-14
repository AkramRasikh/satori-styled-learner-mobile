import {useEffect} from 'react';

const useFormatUnderlyingWords = ({
  setFormattedData,
  formatTextForTargetWords,
  formattedData,
  content,
  setUpdateWordList,
  updateWordList,
}) => {
  useEffect(() => {
    if (formattedData?.length === 0 && content?.length > 0) {
      setFormattedData(formatTextForTargetWords());
    } else if (formattedData?.length > 0 && updateWordList) {
      setFormattedData(formatTextForTargetWords());
      setUpdateWordList(false);
    }
  }, [
    formattedData,
    content,
    formatTextForTargetWords,
    updateWordList,
    setFormattedData,
    setUpdateWordList,
  ]);
};

export default useFormatUnderlyingWords;
