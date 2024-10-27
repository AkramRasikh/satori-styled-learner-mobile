import {useEffect} from 'react';

const useInitTopicWordList = ({
  setThisTopicsWords,
  getThisTopicsWords,
  pureWordsUnique,
  topicData,
  targetLanguageLoadedWords,
  setInitJapaneseWordsList,
}) => {
  useEffect(() => {
    setThisTopicsWords(
      getThisTopicsWords({
        pureWordsUnique,
        topicData,
        targetLanguageLoadedWords,
      }),
    );
    setInitJapaneseWordsList(targetLanguageLoadedWords?.length);
  }, []);
};

export default useInitTopicWordList;
