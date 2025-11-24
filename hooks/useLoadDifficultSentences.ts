import {useSelector} from 'react-redux';
import {sortByDueDate} from '../utils/sort-by-due-date';
import {
  getGeneralTopicName,
  stringEndsWithNumber,
} from '../utils/get-general-topic-name';
import useData from '../context/Data/useData';

const useLoadDifficultSentences = () => {
  const targetLanguageLoadedContentMasterState = useSelector(
    state => state.learningContent,
  );
  const adhocTargetLanguageSentencesState = useSelector(
    state => state.sentences,
  );

  const {squashedSentenceIdsViaContentMemoized} = useData();
  const getSentencesMarkedAsDifficult = () => {
    const difficultSentences = [];
    targetLanguageLoadedContentMasterState?.forEach(contentWidget => {
      const generalTopicName = !stringEndsWithNumber(contentWidget.title)
        ? contentWidget.title
        : getGeneralTopicName(contentWidget.title);
      const hasDueContent =
        squashedSentenceIdsViaContentMemoized[generalTopicName]?.isDue;

      if (!hasDueContent) {
        return;
      }

      const contentIndex = contentWidget.contentIndex;
      const thisTopic = contentWidget.title;
      const isCore = contentWidget.isCore;
      const isArticle = contentWidget?.isArticle;
      const snippets = contentWidget?.snippets;

      const isMediaContent =
        contentWidget.origin === 'netflix' ||
        contentWidget.origin === 'youtube' ||
        isArticle;
      const content = contentWidget?.content;
      content?.forEach((sentenceInContent, index) => {
        const isLast = content.length - 1 === index;
        difficultSentences.push({
          sentenceIndex: index,
          topic: thisTopic,
          isCore,
          isMediaContent,
          contentIndex,
          generalTopic: generalTopicName,
          previousSentence: index > 0 ? content[index - 1].targetLang : null,
          ...sentenceInContent,
          endTime: isLast ? null : content[index + 1].time,
          isContent: true,
          indexKey: contentWidget.id,
        });
      });
      snippets?.forEach(snippet => {
        if (snippet?.reviewData?.due) {
          difficultSentences.push({
            topic: thisTopic,
            isCore,
            isMediaContent,
            contentIndex,
            generalTopic: generalTopicName,
            ...snippet,
            isSnippet: true,
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
