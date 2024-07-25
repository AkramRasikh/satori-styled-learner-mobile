import {useEffect} from 'react';

const useInitTopicWordList = ({
  setThisTopicsWords,
  getThisTopicsWords,
  pureWordsUnique,
  topicData,
  japaneseLoadedWords,
  setInitJapaneseWordsList,
}) => {
  useEffect(() => {
    setThisTopicsWords(
      getThisTopicsWords({
        pureWordsUnique,
        topicData,
        japaneseLoadedWords,
      }),
    );
    setInitJapaneseWordsList(japaneseLoadedWords?.length);
  }, []);
};

export default useInitTopicWordList;
