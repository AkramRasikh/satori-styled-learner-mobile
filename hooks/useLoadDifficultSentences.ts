import {useSelector} from 'react-redux';
import {sortByDueDate} from '../utils/sort-by-due-date';

const useLoadDifficultSentences = () => {
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const adhocTargetLanguageSentencesState = useSelector(
    state => state.sentences,
  );

  const getSentencesMarkedAsDifficult = () => {
    const difficultSentences = [];
    targetLanguageLoadedContentMasterState?.forEach(contentWidget => {
      const contentIndex = contentWidget.contentIndex;
      const thisTopic = contentWidget.title;
      const isCore = contentWidget.isCore;
      const isMediaContent =
        contentWidget.origin === 'netflix' ||
        contentWidget.origin === 'youtube';
      const content = contentWidget.content;
      content.forEach(sentenceInContent => {
        if (
          sentenceInContent?.nextReview ||
          sentenceInContent?.reviewData?.due
        ) {
          difficultSentences.push({
            topic: thisTopic,
            isCore,
            isMediaContent,
            contentIndex,
            ...sentenceInContent,
          });
        }
      });
    });

    adhocTargetLanguageSentencesState.forEach(contentWidget => {
      const thisTopic = contentWidget?.topic || 'sentence-helper';
      const isSentenceHelper = contentWidget?.matchedWords?.length > 0;
      const isCore = contentWidget?.isCore;
      const nextReview = contentWidget?.nextReview;
      if (nextReview || contentWidget?.reviewData?.due) {
        difficultSentences.push({
          topic: thisTopic,
          isSentenceHelper: isSentenceHelper,
          isCore,
          isAdhoc: true,
          ...contentWidget,
        });
      }
    });

    return difficultSentences;
  };

  const getAllDataReady = () => {
    const allInitDifficultSentences =
      getSentencesMarkedAsDifficult()?.sort(sortByDueDate);

    return allInitDifficultSentences;
  };

  return {getAllDataReady};
};

export default useLoadDifficultSentences;
