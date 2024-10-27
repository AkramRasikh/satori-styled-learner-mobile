import {useEffect} from 'react';

const useInitTopicWordList = ({
  setThisTopicsWords,
  getThisTopicsWords,
  pureWordsUnique,
  topicData,
  targetLanguageLoadedWords,
  setInitTargetLanguageWordsList,
}) => {
  useEffect(() => {
    setThisTopicsWords(
      getThisTopicsWords({
        pureWordsUnique,
        topicData,
        targetLanguageLoadedWords,
      }),
    );
    setInitTargetLanguageWordsList(targetLanguageLoadedWords?.length);
  }, []);
};

export default useInitTopicWordList;
