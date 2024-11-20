import {sortByDueDate} from '../utils/sort-by-due-date';

const useLoadDifficultSentences = ({
  adhocTargetLanguageSentencesState,
  targetLanguageLoadedContentMasterState,
}) => {
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
      const thisTopic = contentWidget.topic;
      const isCore = contentWidget?.isCore;
      const nextReview = contentWidget?.nextReview;
      if (nextReview || contentWidget?.reviewData?.due) {
        difficultSentences.push({
          topic: thisTopic,
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
