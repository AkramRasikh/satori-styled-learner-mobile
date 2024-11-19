import {sortByDueDate} from '../utils/sort-by-due-date';

const useLoadDifficultSentences = ({
  adhocTargetLanguageSentencesState,
  targetLanguageLoadedContentMasterState,
  targetLanguageSnippetsState,
}) => {
  const addSnippetsToDifficultSentences = allInitDifficultSentences => {
    return allInitDifficultSentences.map(sentenceData => {
      return {
        ...sentenceData,
        snippets: targetLanguageSnippetsState.filter(
          snippetData => snippetData.sentenceId === sentenceData.id,
        ),
      };
    });
  };

  const getSentencesMarkedAsDifficult = () => {
    const difficultSentences = [];
    targetLanguageLoadedContentMasterState?.forEach(contentWidget => {
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
    const difficultSentencesWithSnippets = addSnippetsToDifficultSentences(
      allInitDifficultSentences,
    );

    return difficultSentencesWithSnippets;
  };

  return {getAllDataReady};
};

export default useLoadDifficultSentences;
