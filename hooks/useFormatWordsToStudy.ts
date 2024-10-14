import {useEffect} from 'react';
import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {isCardDue} from '../utils/is-card-due';

const useFormatWordsToStudy = ({
  japaneseWordsState,
  setWordStudyState,
  setTagsState,
  setGeneralTopicState,
  japaneseLoadedContent,
  japaneseAdhocLoadedSentences,
  setDueCardsState,
}) => {
  const timeNow = new Date();
  useEffect(() => {
    const dueCards = [];
    const tagsAvailable = [];
    const generalTopics = [];

    const formattedJapaneseWordData = japaneseWordsState.map(wordData => {
      const thisWordsContext = wordData.contexts;
      const reviewCardDue = wordData?.reviewData?.due;

      const isCardDueBool = reviewCardDue
        ? isCardDue({cardDate: new Date(reviewCardDue), nowDate: timeNow})
        : false;
      const contextData = [];
      const thisWordsCategories = [];

      thisWordsContext.forEach(contextId => {
        japaneseLoadedContent.forEach(contentData => {
          const content = contentData.content;
          const generalTopicTitle = getGeneralTopicName(contentData.title);
          const tags = content?.tags;
          const isMediaContent =
            contentData?.origin === 'netflix' ||
            contentData?.origin === 'youtube';

          const contextIdMatchesSentence = content.find(
            contentSentence => contentSentence.id === contextId,
          );
          if (contextIdMatchesSentence) {
            contextData.push({
              ...contextIdMatchesSentence,
              title: generalTopicTitle,
              fullTitle: contentData.title,
              tags,
              isMediaContent,
            });
            if (!generalTopics.includes(generalTopicTitle)) {
              generalTopics.push(generalTopicTitle);
            }
            thisWordsCategories.push(generalTopicTitle);

            if (tags && !tagsAvailable.includes(tags)) {
              tagsAvailable.push(tags);
            }
            if (tags) {
              thisWordsCategories.push(tags);
            }
          }
        });
        // conditionally
        japaneseAdhocLoadedSentences.forEach(adhocSentenceData => {
          const generalTopicTitle = adhocSentenceData.topic;
          const tags = adhocSentenceData?.tags;

          const adhocSentenceDataId = adhocSentenceData.id;

          const matchingContextID = contextId === adhocSentenceDataId;

          if (matchingContextID) {
            contextData.push({
              ...adhocSentenceData,
              title: generalTopicTitle,
              tags,
            });
            if (!generalTopics.includes(generalTopicTitle)) {
              generalTopics.push(generalTopicTitle);
            }

            if (tags?.length > 0) {
              tags.forEach(singleTag => {
                if (singleTag && !tagsAvailable.includes(singleTag)) {
                  tagsAvailable.push(singleTag);
                }
              });
            }

            thisWordsCategories.push(generalTopicTitle);

            if (tags?.length) {
              thisWordsCategories.push(...tags);
            }
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
    });
    setWordStudyState(formattedJapaneseWordData);
    setTagsState(tagsAvailable);
    setGeneralTopicState(generalTopics);
    setDueCardsState(dueCards);
  }, []);
};
export default useFormatWordsToStudy;
