import {useEffect} from 'react';
import {getGeneralTopicName} from '../utils/get-general-topic-name';

const useFormatWordsToStudy = ({
  japaneseWordsState,
  setWordStudyState,
  setTagsState,
  setGeneralTopicState,
  japaneseLoadedContent,
  japaneseAdhocLoadedSentences,
}) => {
  useEffect(() => {
    const tagsAvailable = [];
    const generalTopics = [];

    const formattedJapaneseWordData = japaneseWordsState.map(wordData => {
      const thisWordsContext = wordData.contexts;

      const contextData = [];
      const thisWordsCategories = [];

      thisWordsContext.forEach(contextId => {
        japaneseLoadedContent.forEach(contentData => {
          const content = contentData.content;
          const generalTopicTitle = getGeneralTopicName(contentData.title);
          const tags = content?.tags;

          const contextIdMatchesSentence = content.find(
            contentSentence => contentSentence.id === contextId,
          );
          if (contextIdMatchesSentence) {
            contextData.push({
              ...contextIdMatchesSentence,
              title: generalTopicTitle,
              tags,
            });
            if (!generalTopics.includes(generalTopicTitle)) {
              generalTopics.push(generalTopicTitle);
            }
            thisWordsCategories.push(generalTopicTitle);

            if (!tagsAvailable.includes(tags)) {
              tagsAvailable.push(tags);
            }
            if (tags) {
              thisWordsCategories.push(tags);
            }
          }
        });
        // conditionally
        japaneseAdhocLoadedSentences.forEach(adhocSentenceData => {
          const generalTopicTitle = getGeneralTopicName(
            adhocSentenceData.topic,
          );
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
                if (!tagsAvailable.includes(singleTag)) {
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

      return {
        ...wordData,
        contextData,
        thisWordsCategories,
      };
    });
    setWordStudyState(formattedJapaneseWordData);
    setTagsState(tagsAvailable);
    setGeneralTopicState(generalTopics);
  }, []);
};
export default useFormatWordsToStudy;
