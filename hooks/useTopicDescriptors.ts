import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {
  checkIsFutureReviewNeeded,
  isUpForReview,
} from '../utils/is-up-for-review';

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
  const hasAudioCheck = topicKey =>
    targetLanguageLoadedContentState.some(
      key => key.title === topicKey && key.hasAudio,
    );

  const isYoutubeVideo = topicOption => {
    return targetLanguageLoadedContentState.some(
      topicDisplayed =>
        topicDisplayed?.origin === 'youtube' &&
        topicDisplayed.title.split('-').slice(0, -1).join('-') === topicOption,
    );
  };

  const isDueReview = (topicOption, singular, isReview) => {
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

  const isCoreContent = (topicOption, singular) => {
    if (singular) {
      const thisData = targetLanguageLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const thisDataIsCoreStatus = thisData?.isCore;
      return thisDataIsCoreStatus;
    }

    return targetLanguageLoadedContentState.some(jpContent => {
      if (jpContent.title.split('-').slice(0, -1).join('-') === topicOption) {
        const isCoreStatus = jpContent?.isCore;
        return isCoreStatus;
      }
    });
  };

  const isNeedsFutureReview = ({topicOption, singular}) => {
    if (singular) {
      const thisData = targetLanguageLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const nextReview = thisData?.nextReview;

      const res = checkIsFutureReviewNeeded({nextReview, todayDate: today});
      return res;
    }

    const nextReviewDateDueForGeneralTopicDue =
      targetLanguageLoadedContentState.some(jpContent => {
        const generalTopicName = getGeneralTopicName(jpContent.title);

        if (generalTopicName === topicOption) {
          const nextReview = jpContent?.nextReview;
          return checkIsFutureReviewNeeded({nextReview, todayDate: today});
        }
      });

    return nextReviewDateDueForGeneralTopicDue;
  };

  return {
    isYoutubeVideo,
    isDueReview,
    isCoreContent,
    hasAudioCheck,
    isNeedsFutureReview,
  };
};

export default useTopicDescriptors;
