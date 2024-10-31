import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {isUpForReview} from '../utils/is-up-for-review';

const isDueReviewSingular = ({
  topicOption,
  targetLanguageLoadedContentState,
  today,
}) => {
  const thisData = targetLanguageLoadedContentState.find(
    topicDisplayed => topicDisplayed.title === topicOption,
  );

  const nextReview = thisData?.nextReview;

  return isUpForReview({nextReview, todayDate: today});
};

const useTopicDescriptors = (targetLanguageLoadedContentState, today) => {
  const isDueReview = (topicOption, singular) => {
    if (singular) {
      return isDueReviewSingular({
        topicOption,
        targetLanguageLoadedContentState,
        today,
      });
    }

    const nextReviewDateDueForGeneralTopicDue =
      targetLanguageLoadedContentState.some(jpContent => {
        const generalTopicName = getGeneralTopicName(jpContent.title);

        if (generalTopicName === topicOption) {
          const nextReview = jpContent?.nextReview;
          return isUpForReview({nextReview, todayDate: today});
        }
      });

    return nextReviewDateDueForGeneralTopicDue;
  };

  return {
    isDueReview,
  };
};

export default useTopicDescriptors;
