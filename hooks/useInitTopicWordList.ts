import {useEffect} from 'react';

const useInitTopicWordList = ({
  targetLanguageLoadedWords,
  setInitTargetLanguageWordsList,
}) => {
  useEffect(() => {
    setInitTargetLanguageWordsList(targetLanguageLoadedWords?.length);
  }, []);
};

export default useInitTopicWordList;
