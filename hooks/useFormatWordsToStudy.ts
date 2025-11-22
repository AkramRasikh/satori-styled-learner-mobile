import {useEffect} from 'react';
import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {isCardDue} from '../utils/is-card-due';

const useFormatWordsToStudy = ({
  targetLanguageWordsState,
  setWordStudyState,
  setGeneralTopicState,
  targetLanguageLoadedContent,
  targetLanguageLoadedSentences,
  setDueCardsState,
  languageSelectedState,
}) => {
  const timeNow = new Date();
  useEffect(() => {
    const dueCards = [];
    const generalTopics = [];

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
          targetLanguageLoadedContent.forEach(contentData => {
            const content = contentData.content;
            const isArticle = contentData?.isArticle;
            const generalTopicTitle = getGeneralTopicName(contentData.title);

            const isMediaContent =
              contentData?.origin === 'netflix' ||
              contentData?.origin === 'youtube' ||
              isArticle;

            const contextIdMatchesSentence = content.find(
              contentSentence => contentSentence.id === contextId,
            );
            if (contextIdMatchesSentence) {
              contextData.push({
                ...contextIdMatchesSentence,
                title: generalTopicTitle,
                fullTitle: contentData.title,
                isMediaContent,
              });
              if (
                generalTopicTitle &&
                !generalTopics.includes(generalTopicTitle)
              ) {
                generalTopics.push(generalTopicTitle);
              }
              thisWordsCategories.push(generalTopicTitle);
            }
          });
          // conditionally
          targetLanguageLoadedSentences.forEach(adhocSentenceData => {
            const generalTopicTitle = adhocSentenceData.topic;

            const adhocSentenceDataId = adhocSentenceData.id;

            const matchingContextID = contextId === adhocSentenceDataId;

            if (matchingContextID) {
              contextData.push({
                ...adhocSentenceData,
                title: generalTopicTitle,
              });
              if (
                generalTopicTitle &&
                !generalTopics.includes(generalTopicTitle)
              ) {
                generalTopics.push(generalTopicTitle);
              }

              thisWordsCategories.push(generalTopicTitle);
            }
          });
        });

        const fullWordData = {
          ...wordData,
          contextData,
          isCardDue: isCardDueBool,
          thisWordsCategories,
        };

        if (isCardDueBool && dueCards) {
          dueCards.push(fullWordData);
        }
        return fullWordData;
      },
    );
    setWordStudyState(formattedTargetLanguageWordData);
    setGeneralTopicState(generalTopics);
    setDueCardsState(dueCards);
  }, [languageSelectedState]);
};
export default useFormatWordsToStudy;
