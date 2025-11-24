import {useEffect} from 'react';
import {isCardDue} from '../utils/is-card-due';
import useData from '../context/Data/useData';

const useFormatWordsToStudy = ({
  targetLanguageWordsState,
  setWordStudyState,
  languageSelectedState,
}) => {
  const {transcriptIdToDataMap} = useData();

  const timeNow = new Date();
  useEffect(() => {
    const formattedTargetLanguageWordData = targetLanguageWordsState.map(
      wordData => {
        if (!wordData) {
          // quick fix
          return;
        }

        const thisWordsContext = wordData.contexts;
        const reviewCardDue = wordData?.reviewData?.due;

        const isCardDueBool = reviewCardDue
          ? isCardDue({cardDate: new Date(reviewCardDue), nowDate: timeNow})
          : false;
        const contextData = [];
        const thisWordsCategories = [];

        thisWordsContext.forEach(contextId => {
          const wordDataFromMap = transcriptIdToDataMap[contextId];
          if (wordDataFromMap) {
            contextData.push({
              ...wordDataFromMap,
              title: wordDataFromMap?.generalTopic,
              fullTitle: wordDataFromMap.topic,
            });
            thisWordsCategories.push(wordDataFromMap?.generalTopic);
          }
        });

        const fullWordData = {
          ...wordData,
          contextData,
          isCardDue: isCardDueBool,
          thisWordsCategories,
        };

        return fullWordData;
      },
    );
    setWordStudyState(formattedTargetLanguageWordData);
  }, [languageSelectedState]);
};
export default useFormatWordsToStudy;
