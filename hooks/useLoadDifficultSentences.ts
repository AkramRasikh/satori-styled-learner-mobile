import {useSelector} from 'react-redux';
import {sortByDueDate} from '../utils/sort-by-due-date';
import {getGeneralTopicName} from '../utils/get-general-topic-name';

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
      content.forEach((sentenceInContent, index) => {
        if (
          sentenceInContent?.nextReview ||
          sentenceInContent?.reviewData?.due
        ) {
          const thisGeneralTopicsName = getGeneralTopicName(thisTopic);

          difficultSentences.push({
            sentenceIndex: index,
            topic: thisTopic,
            isCore,
            isMediaContent,
            contentIndex,
            generalTopic: thisGeneralTopicsName,
            previousSentence: index > 0 ? content[index - 1].targetLang : null,
            ...sentenceInContent,
          });
        }
      });
    });

    adhocTargetLanguageSentencesState.forEach(contentWidget => {
      const thisTopic = contentWidget?.topic || 'sentence-helper';
      const isSentenceHelper =
        contentWidget?.matchedWords?.length > 0 ||
        contentWidget?.matchedWordsId?.length > 0;
      const isCore = contentWidget?.isCore;
      const nextReview =
        contentWidget?.nextReview || contentWidget?.reviewData?.due;
      if (nextReview) {
        difficultSentences.push({
          topic: thisTopic,
          isSentenceHelper: isSentenceHelper,
          isCore,
          isAdhoc: true,
          generalTopic: 'sentence-helper',
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
